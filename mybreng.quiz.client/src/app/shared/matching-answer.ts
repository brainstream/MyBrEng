export interface MatchingAnswer {
    slot: string | null;
    answer: string;
}

export function parseMatchingAnswer(text: string): MatchingAnswer {
    const result = JSON.parse(text);
    return result && 'slot' in result && 'answer' in result ? result : { slot: null, answer: '' };
}
