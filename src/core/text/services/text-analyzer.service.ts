import { Injectable } from '@nestjs/common';

@Injectable()
export class TextAnalyzerService {
  analyze(text: string) {
    const normalized = text.replace(/[^\w\s]|_/g, '').toLowerCase();
    const paragraphs = text.split(/\n+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const words = normalized.split(/\s+/).filter(Boolean);
    const characterCount = text.replace(/\s/g, '').length;

    const longestLength = Math.max(...words.map(w => w.length));
    const longestWords = [...new Set(words.filter(w => w.length === longestLength))];

    return {
      wordCount: words.length,
      characterCount,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      longestWords,
    };
  }
}
