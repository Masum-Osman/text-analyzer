export class TextAnalyzerService {
    analyze(text: string) {
        const cleaned = text.replace(/[^\w\s]/gi, '').toLowerCase();

        const words = cleaned.split(/\s+/).filter(Boolean);
        const characters = cleaned.replace(/\s/g, '');
        const sentences = text.split(/[.!?]+/).filter(Boolean);
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    
        const longestLength = words.reduce((max, w) => Math.max(max, w.length), 0);
        const longestWords = Array.from(new Set(words.filter(w => w.length === longestLength)));

        return {
            wordCount: words.length,
            characterCount: characters.length,
            sentenceCount: sentences.length,
            paragraphCount: paragraphs.length,
            longestWords,
        };
    }
}