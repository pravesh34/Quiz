
import { Component, inject } from '@angular/core';
import { DataService } from '../services/data.service';
import { GenAiService } from '../services/genai.service';
import { Question } from '../services/types';

@Component({
  selector: 'app-admin',
  template: `
    <div class="p-6 bg-white min-h-full">
      <h2 class="text-2xl font-bold mb-6 text-slate-800">Admin & Data Quality Dashboard</h2>
      
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
         <div class="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
           <div class="text-3xl font-bold text-indigo-600">{{ totalQuestions }}</div>
           <div class="text-xs font-bold text-indigo-400 uppercase">Total Questions</div>
         </div>
         <div class="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
           <div class="text-3xl font-bold text-emerald-600">{{ verifiedPct }}%</div>
           <div class="text-xs font-bold text-emerald-400 uppercase">Verified</div>
         </div>
         <div class="bg-amber-50 p-4 rounded-lg border border-amber-100">
           <div class="text-3xl font-bold text-amber-600">{{ avgConfidence }}</div>
           <div class="text-xs font-bold text-amber-400 uppercase">Avg OCR Conf.</div>
         </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table class="w-full text-sm text-left">
          <thead class="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
            <tr>
              <th class="p-4">ID</th>
              <th class="p-4">Question Preview</th>
              <th class="p-4">Source</th>
              <th class="p-4">Status</th>
              <th class="p-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (q of questions(); track q.id) {
              <tr class="hover:bg-slate-50">
                <td class="p-4 font-mono text-xs text-slate-400">{{ q.id }}</td>
                <td class="p-4 max-w-md">
                   <div class="font-medium text-slate-800 truncate">{{ q.presentation_text }}</div>
                   <div class="text-xs text-slate-500 mt-1">{{ q.chapter_id }} • {{ q.year }}</div>
                </td>
                <td class="p-4">
                  <a [href]="q.source_url" target="_blank" class="text-indigo-600 hover:underline text-xs">
                    View PDF
                  </a>
                </td>
                <td class="p-4">
                  @if (q.verified) {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      Verified
                    </span>
                  } @else {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      Pending
                    </span>
                  }
                </td>
                <td class="p-4">
                  @if (!q.verified) {
                    <button (click)="verify(q)" class="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
                      Verify
                    </button>
                    <button (click)="aiCheck(q)" class="ml-2 px-3 py-1 bg-violet-100 text-violet-700 text-xs rounded hover:bg-violet-200">
                      AI Check
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      
      <div class="mt-8 p-4 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-500">
        Data ingestion simulated. In production, this connects to the Python crawler output.
      </div>
    </div>
  `,
  standalone: true
})
export class AdminComponent {
  dataService = inject(DataService);
  genAi = inject(GenAiService);

  questions = this.dataService.questions;

  get totalQuestions() { return this.questions().length; }
  
  get verifiedPct() {
    const verified = this.questions().filter(q => q.verified).length;
    return Math.round((verified / this.totalQuestions) * 100);
  }

  get avgConfidence() {
    const sum = this.questions().reduce((acc, q) => acc + q.ocr_confidence, 0);
    return (sum / this.totalQuestions).toFixed(2);
  }

  verify(q: Question) {
    this.dataService.verifyQuestion(q.id);
  }

  async aiCheck(q: Question) {
    alert(`Checking question ${q.id} with Gemini...`);
    const result = await this.genAi.verifyContent(q);
    alert(`AI Verification Result:\nVerified: ${result.verified}\nNotes: ${result.notes}`);
    if(result.verified) {
        this.dataService.verifyQuestion(q.id);
    }
  }
}
