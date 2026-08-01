export type SetScore = {
  self: string;
  opponent: string;
};

export const EMPTY_SETS: SetScore[] = [
  { self: '', opponent: '' },
  { self: '', opponent: '' },
  { self: '', opponent: '' },
];

/** Composes per-set scores into the single string the backend stores, e.g. "6-4 3-6 10-7". */
export function computeScoreString(sets: SetScore[]): string {
  return sets
    .filter((set) => set.self.trim() !== '' && set.opponent.trim() !== '')
    .map((set) => `${set.self.trim()}-${set.opponent.trim()}`)
    .join(' ');
}

/** Inverse of computeScoreString, padded to 3 sets to match the fixed-length edit form. */
export function parseScoreString(score: string): SetScore[] {
  const sets = score
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part): SetScore => {
      const [self, opponent] = part.split('-');
      return { self: self ?? '', opponent: opponent ?? '' };
    });

  return Array.from({ length: 3 }, (_, index) => sets[index] ?? { self: '', opponent: '' });
}
