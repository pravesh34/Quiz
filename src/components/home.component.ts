
import { Component, inject, output } from '@angular/core';
import { DataService } from '../services/data.service';
import { Chapter } from '../services/types';

@Component({
  selector: 'app-home',
  template: `
    <div class="space-y-8 animate-fade-in">
      <div class="text-center space-y-4">
        <h1 class="text-4xl font-extrabold text-slate-800 tracking-tight">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            Organic Chemistry
          </span>
          <br>PYQ Master
        </h1>
        <p class="text-slate-600 max-w-xl mx-auto text-lg">
          Master CBSE Class 12 Organic Chemistry with authentic Past Year Questions (2019-2024). 
          Chapter-wise drills, smart explanations, and exam-mode challenges.
        </p>
        
        <div class="flex justify-center gap-4 pt-4">
          <button (click)="onSelectMode('challenge')" 
            class="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
            <i class="fas fa-random"></i> Random Challenge
          </button>
          <button (click)="onSelectMode('survival')" 
            class="px-8 py-3 bg-rose-500 text-white rounded-full font-semibold shadow-lg shadow-rose-200 hover:bg-rose-600 hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
            <i class="fas fa-fire"></i> Survival Mode
          </button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div class="col-span-full pb-2">
           <h2 class="text-xl font-bold text-slate-800 flex items-center gap-2">
             <i class="fas fa-book-open text-indigo-500"></i> Select a Chapter
           </h2>
        </div>

        @for (chapter of dataService.chapters(); track chapter.id) {
          <button (click)="selectChapter.emit(chapter)" 
            class="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 transition-all text-left">
            <div class="flex justify-between items-start">
              <div>
                <span class="text-xs font-bold tracking-wider text-indigo-500 uppercase mb-1 block">
                  {{ chapter.syllabus_code }}
                </span>
                <h3 class="text-lg font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                  {{ chapter.name }}
                </h3>
                <p class="text-slate-500 text-sm mt-2">
                  {{ dataService.getQuestionsByChapter(chapter.id).length }} PYQs available
                </p>
              </div>
              <div class="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
          </button>
        }
      </div>

      <!-- Quick Stats Footer -->
      <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div class="text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ dataService.userStats().xp }}</div>
          <div class="text-xs text-slate-500 uppercase font-bold">XP Earned</div>
        </div>
        <div class="text-center border-l border-r border-slate-100">
          <div class="text-2xl font-bold text-emerald-600">{{ dataService.userStats().correctAnswers }}</div>
          <div class="text-xs text-slate-500 uppercase font-bold">Solved</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-500">{{ dataService.userStats().streak }} <i class="fas fa-fire text-sm"></i></div>
          <div class="text-xs text-slate-500 uppercase font-bold">Streak</div>
        </div>
      </div>
    </div>
  `,
  standalone: true
})
export class HomeComponent {
  dataService = inject(DataService);
  selectChapter = output<Chapter>();
  
  onSelectMode(mode: string) {
    // For demo simplicity, random challenge just picks a random chapter
    const chapters = this.dataService.chapters();
    const random = chapters[Math.floor(Math.random() * chapters.length)];
    this.selectChapter.emit(random);
  }
}
