import type { Handedness, MatchResult, PlayStyle, Surface } from '@/types/api';

export const playStyleLabels: Record<PlayStyle | 'UNKNOWN', string> = {
  BASELINER: 'Baseliner',
  AGGRESSIVE_BASELINER: 'Agressivo de fundo',
  ALL_COURT: 'All-court',
  SERVE_AND_VOLLEY: 'Saque e voleio',
  COUNTERPUNCHER: 'Contra-atacador',
  PUSHER: 'Consistente',
  UNKNOWN: 'Não mapeado',
};

export const surfaceLabels: Record<Surface | 'ALL', string> = {
  ALL: 'Todas',
  CLAY: 'Saibro',
  HARD: 'Quadra dura',
  GRASS: 'Grama',
  INDOOR: 'Indoor',
};

export const surfaceOptions = (Object.keys(surfaceLabels) as (Surface | 'ALL')[]).map((value) => ({
  value,
  label: surfaceLabels[value],
}));

export const surfaceFormOptions = surfaceOptions.filter((option) => option.value !== 'ALL') as {
  value: Surface;
  label: string;
}[];

export const handednessLabels: Record<Handedness, string> = {
  RIGHT: 'Destro',
  LEFT: 'Canhoto',
};

export const handednessOptions = (Object.keys(handednessLabels) as Handedness[]).map((value) => ({
  value,
  label: handednessLabels[value],
}));

export const playStyleOptions = (Object.keys(playStyleLabels) as (PlayStyle | 'UNKNOWN')[])
  .filter((value) => value !== 'UNKNOWN')
  .map((value) => ({ value: value as PlayStyle, label: playStyleLabels[value] }));

export const matchResultLabels: Record<MatchResult, string> = {
  WIN: 'Vitória',
  LOSS: 'Derrota',
};

export const matchResultOptions = (Object.keys(matchResultLabels) as MatchResult[]).map((value) => ({
  value,
  label: matchResultLabels[value],
}));
