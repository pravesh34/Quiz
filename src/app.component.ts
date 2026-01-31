
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home.component';
import { GameComponent } from './components/game.component';
import { AdminComponent } from './components/admin.component';
import { DataService } from './services/data.service';
import { Chapter, Question } from './services/types';

type ViewState = 'home' | 'game' | 'admin';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HomeComponent, GameComponent, AdminComponent],
  template: `
    <div class="h-screen flex flex-col bg-slate-50 text-slate-900">
      <!-- Navbar -->
      <nav class="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div class="flex items-center gap-3 cursor-pointer" (click)="view.set('home')">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            C
          </div>
          <span class="font-bold text-slate-800 tracking-tight">PYQ Master</span>
        </div>
        
        <div class="flex items-center gap-4">
           <button (click)="view.set('admin')" 
             class="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
             <i class="fas fa-shield-alt mr-1"></i> Admin
           </button>
           <a href="https://github.com/example/repo" target="_blank" class="text-slate-400 hover:text-slate-800 transition-colors">
             <i class="fab fa-github text-lg"></i>
           </a>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-hidden relative">
        @switch (view()) {
          @case('home') {
            <div class="h-full overflow-y-auto p-6">
               <app-home (selectChapter)="startChapterGame($event)"></app-home>
            </div>
          }
          @case('game') {
             <div class="h-full p-4 md:p-6 bg-slate-50">
               <app-game 
                 [questions]="activeQuestions()" 
                 [back]="goBack"
               ></app-game>
             </div>
          }
          @case('admin') {
            <div class="h-full overflow-y-auto">
               <app-admin></app-admin>
            </div>
          }
        }
      </main>
    </div>
  `
})
export class AppComponent {
  dataService = inject(DataService);
  view = signal<ViewState>('home');
  activeChapter = signal<Chapter | null>(null);

  // Computes the questions to send to the game based on selection
  activeQuestions = computed(() => {
    const chapter = this.activeChapter();
    if (!chapter) return [];
    return this.dataService.getQuestionsByChapter(chapter.id);
  });
  
  // Method to pass to GameComponent to return to home
  goBack = () => {
    this.view.set('home');
    this.activeChapter.set(null);
  };

  startChapterGame(chapter: Chapter) {
    this.activeChapter.set(chapter);
    this.view.set('game');
  }
}
