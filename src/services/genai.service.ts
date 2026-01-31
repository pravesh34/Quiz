
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Question } from './types';

@Injectable({
  providedIn: 'root'
})
export class GenAiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initialize with environment API key
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async generateExplanation(question: Question): Promise<string> {
    try {
      const prompt = `
        Context: CBSE Class 12 Organic Chemistry.
        Question: ${question.original_text}
        Correct Answer Option: ${question.options.find(o => o.is_correct)?.option_text}
        
        Task: Provide a concise (2-3 sentences) chemical explanation for why this answer is correct. Mention the reaction name if applicable.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "No explanation generated.";
    } catch (error) {
      console.error('GenAI Error:', error);
      return "Explanation temporarily unavailable.";
    }
  }

  async verifyContent(question: Question): Promise<{verified: boolean, notes: string}> {
      try {
          const prompt = `
            Analyze this chemistry question for accuracy suitable for CBSE Class 12.
            Question: ${question.presentation_text}
            Options: ${JSON.stringify(question.options)}
            
            Is this question chemically accurate and unambiguous? Return JSON.
          `;

          // In a real app we'd use responseSchema. For this demo, we simulate a check.
          const response = await this.ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: prompt
          });
          
          return { verified: true, notes: response.text.slice(0, 100) };
      } catch (e) {
          return { verified: false, notes: "AI Check failed" };
      }
  }
}
