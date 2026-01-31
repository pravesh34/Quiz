
import { Component, inject, input, signal, computed, effect } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { DataService } from '../services/data.service';
import { GenAiService } from '../services/genai.service';
import { Question, Option } from '../services/types';

@Component({
  selector: 'app-game',
  imports: [CommonModule, NgClass],
  template: `
    <div class="max-w-3xl mx-auto h-full flex flex-col">
      <!-- Header / Progress -->
      <div class="flex items-center justify-between mb-6">
        <button (click)="goBack()" class="text-slate-400 hover:text-slate-600 transition-colors">
          <i class="fas fa-arrow-left mr-1"></i> Quit
        </button>
        <div class="flex-1 mx-8">
          <div class="flex justify-between text-xs font-bold text-slate-500 mb-1">
            <span>Question {{ currentIndex() + 1 }} / {{ questions().length }}</span>
            <span>{{ score() }} pts</span>
          </div>
          <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full bg-indigo-500 transition-all duration-500" [style.width.%]="progressPct()"></div>
          </div>
        </div>
        <div class="text-slate-600 font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg">
          {{ timerDisplay() }}
        </div>
      </div>

      @if (currentQuestion(); as q) {
        <div class="flex-1 overflow-y-auto pr-2 pb-20">
          <!-- Question Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div class="p-6 md:p-8">
              <!-- Metadata Badge -->
              <div class="flex gap-2 mb-4 flex-wrap">
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                  <i class="fas fa-clock"></i> {{ q.year }}
                </span>
                <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                   {{ q.paper }}
                </span>
                @if (q.verified) {
                   <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                     <i class="fas fa-check-circle"></i> Verified
                   </span>
                } @else {
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">
                     <i class="fas fa-exclamation-triangle"></i> Unverified
                   </span>
                }
              </div>

              <!-- Question Text -->
              <h2 class="text-xl md:text-2xl font-bold text-slate-800 leading-snug mb-6">
                {{ q.presentation_text }}
              </h2>
              
              <!-- Source Toggle -->
              <div class="mb-6">
                 <button (click)="toggleSource()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline decoration-dashed">
                   {{ showSource() ? 'Hide Original Source' : 'Show Original PYQ Text' }}
                 </button>
                 @if (showSource()) {
                   <div class="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 italic font-serif">
                     "{{ q.original_text }}"
                     <div class="mt-1 text-xs not-italic text-slate-400">Source: {{ q.source_url }}</div>
                   </div>
                 }
              </div>

              <!-- Options -->
              <div class="space-y-3">
                @for (opt of q.options; track opt.id) {
                  <button 
                    (click)="selectOption(opt)"
                    [disabled]="hasAnswered()"
                    class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 relative group flex items-start gap-3"
                    [ngClass]="getOptionClass(opt)">
                    
                    <div class="mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                         [ngClass]="getRadioClass(opt)">
                         @if (selectedOption() === opt || (hasAnswered() && opt.is_correct)) {
                            <div class="w-2.5 h-2.5 rounded-full bg-current"></div>
                         }
                    </div>
                    
                    <span class="font-medium">{{ opt.option_text }}</span>

                    @if (hasAnswered() && opt.is_correct) {
                      <i class="fas fa-check-circle text-emerald-500 absolute right-4 top-4 text-xl"></i>
                    }
                    @if (hasAnswered() && selectedOption() === opt && !opt.is_correct) {
                      <i class="fas fa-times-circle text-rose-500 absolute right-4 top-4 text-xl"></i>
                    }
                  </button>
                }
              </div>
            </div>

            <!-- Explanation / Footer -->
            @if (hasAnswered()) {
              <div class="bg-slate-50 p-6 border-t border-slate-100 animate-slide-up">
                <div class="flex items-start gap-3">
                  <div class="text-2xl">
                    @if (isCorrect()) { 💡 } @else { 📚 }
                  </div>
                  <div class="flex-1">
                    <h4 class="font-bold text-slate-800 mb-1">
                      {{ isCorrect() ? 'Well done!' : 'Correct Answer' }}
                    </h4>
                    <p class="text-slate-600 text-sm leading-relaxed mb-3">
                       {{ currentQuestion()?.options?.find(o => o.is_correct)?.explanation || currentQuestion()?.explanation }}
                    </p>
                    
                    @if (aiExplanation()) {
                      <div class="text-xs bg-indigo-50 text-indigo-800 p-3 rounded-lg border border-indigo-100 mt-2">
                        <strong><i class="fas fa-robot"></i> Gemini Insight:</strong> {{ aiExplanation() }}
                      </div>
                    } @else if (!isCorrect()) {
                      <button (click)="askAI()" class="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                        <i class="fas fa-magic"></i> Explain with AI
                      </button>
                    }
                  </div>
                </div>
                
                <div class="mt-6 flex justify-end">
                   <button (click)="nextQuestion()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95">
                     {{ isLastQuestion() ? 'Finish Quiz' : 'Next Question' }} <i class="fas fa-arrow-right ml-2"></i>
                   </button>
                </div>
              </div>
            }
          </div>
        </div>
      }
      
      <!-- Result View -->
      @if (gameEnded()) {
        <div class="text-center py-12 animate-fade-in bg-white rounded-2xl shadow-xl p-8">
           <div class="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-4xl mb-6">
             🏆
           </div>
           <h2 class="text-3xl font-extrabold text-slate-800 mb-2">Quiz Complete!</h2>
           <p class="text-slate-500 mb-8">You mastered the PYQs.</p>
           
           <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
             <div class="bg-slate-50 p-4 rounded-xl">
               <div class="text-3xl font-bold text-indigo-600">{{ score() }}</div>
               <div class="text-xs font-bold text-slate-400 uppercase">Score</div>
             </div>
             <div class="bg-slate-50 p-4 rounded-xl">
               <div class="text-3xl font-bold text-emerald-500">{{ correctCount() }}/{{ questions().length }}</div>
               <div class="text-xs font-bold text-slate-400 uppercase">Correct</div>
             </div>
           </div>

           <button (click)="goBack()" class="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors">
             Back to Chapters
           </button>
        </div>
      }
    </div>
  `,
  standalone: true
})
export class GameComponent {
  dataService = inject(DataService);
  genAi = inject(GenAiService);
  
  // Inputs/Outputs handled via logic for simplicity in this structure
  questions = input.required<Question[]>();
  back = signal<() => void>(() => {}); // Callback

  currentIndex = signal(0);
  currentQuestion = computed(() => this.questions()[this.currentIndex()]);
  
  selectedOption = signal<Option | null>(null);
  hasAnswered = signal(false);
  showSource = signal(false);
  gameEnded = signal(false);
  
  score = signal(0);
  correctCount = signal(0);
  aiExplanation = signal<string>('');

  // Timer logic (simplified)
  timeElapsed = signal(0);
  timerInterval: any;

  constructor() {
    this.startTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeElapsed.update(v => v + 1);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  timerDisplay = computed(() => {
    const min = Math.floor(this.timeElapsed() / 60);
    const sec = this.timeElapsed() % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  });

  progressPct = computed(() => {
     if (this.questions().length === 0) return 0;
     return ((this.currentIndex() + (this.hasAnswered() ? 1 : 0)) / this.questions().length) * 100;
  });

  selectOption(opt: Option) {
    if (this.hasAnswered()) return;
    
    this.selectedOption.set(opt);
    this.hasAnswered.set(true);
    this.stopTimer();

    const isCorrect = opt.is_correct;
    if (isCorrect) {
      this.score.update(s => s + (this.currentQuestion()?.marks || 1) * 10);
      this.correctCount.update(c => c + 1);
    }
    
    this.dataService.updateStats(isCorrect);
  }

  getOptionClass(opt: Option) {
    if (!this.hasAnswered()) {
      return 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-slate-700 bg-slate-50';
    }
    
    if (opt.is_correct) {
      return 'border-emerald-500 bg-emerald-50 text-emerald-800';
    }
    
    if (this.selectedOption() === opt && !opt.is_correct) {
      return 'border-rose-500 bg-rose-50 text-rose-800';
    }
    
    return 'border-slate-100 opacity-50 text-slate-400';
  }

  getRadioClass(opt: Option) {
     if (!this.hasAnswered()) return 'border-slate-300 text-slate-300 group-hover:border-indigo-400 group-hover:text-indigo-400';
     if (opt.is_correct) return 'border-emerald-500 text-emerald-500';
     if (this.selectedOption() === opt) return 'border-rose-500 text-rose-500';
     return 'border-slate-200 text-slate-200';
  }

  toggleSource() {
    this.showSource.update(v => !v);
  }

  isCorrect() {
    return this.selectedOption()?.is_correct ?? false;
  }

  async askAI() {
    this.aiExplanation.set('Thinking...');
    const q = this.currentQuestion();
    if(q) {
      const expl = await this.genAi.generateExplanation(q);
      this.aiExplanation.set(expl);
    }
  }

  nextQuestion() {
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(i => i + 1);
      this.resetState();
    } else {
      this.gameEnded.set(true);
      this.stopTimer();
    }
  }

  isLastQuestion() {
    return this.currentIndex() === this.questions().length - 1;
  }

  resetState() {
    this.selectedOption.set(null);
    this.hasAnswered.set(false);
    this.showSource.set(false);
    this.aiExplanation.set('');
    this.startTimer();
  }

  goBack() {
    // This calls the signal passed from parent
    // In a real app with router, this would be router.navigate
    // Since we're using signals for view switching, we need to signal the parent.
    // Hack: We can dispatch a custom event or rely on the parent logic. 
    // For this Applet structure, we'll assume the parent passed a handler or we access logic differently.
    // We'll rely on the template binding in app.component to handle the view switch, 
    // but here we just need to trigger the exit.
    // Actually, `back` is a signal containing a function.
    this.back()();
  }
}
