export interface MatchingAnswer {
    slot: string | null;
    answer: string;
}

export function parseMatchingAnswer(text: string): MatchingAnswer {
    const result: unknown = JSON.parse(text);
    return result && typeof result === 'object' && 'slot' in result && 'answer' in result ?
        result as MatchingAnswer :
        { slot: null, answer: '' };
}
