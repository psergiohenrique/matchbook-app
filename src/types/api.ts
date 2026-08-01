export type Handedness = 'RIGHT' | 'LEFT';
export type PlayStyle =
  | 'BASELINER'
  | 'AGGRESSIVE_BASELINER'
  | 'ALL_COURT'
  | 'SERVE_AND_VOLLEY'
  | 'COUNTERPUNCHER'
  | 'PUSHER';
export type Surface = 'HARD' | 'CLAY' | 'GRASS' | 'INDOOR';
export type MatchResult = 'WIN' | 'LOSS';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type SocialLoginInput = {
  idToken: string;
  provider: 'GOOGLE' | 'APPLE';
  fullName?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  dominantHand: Handedness | null;
  backhandType: string | null;
  yearsPlaying: number | null;
  heightCm: number | null;
  weightKg: number | null;
};

export type UpdateProfileInput = {
  dominantHand?: Handedness | null;
  backhandType?: string | null;
  yearsPlaying?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
};

export type OpponentProfile = {
  id: string;
  name: string;
  handedness: Handedness;
  playStyle: PlayStyle;
  strengths: string[];
  weaknesses: string[];
  notes?: string | null;
};

export type CreateOpponentProfileInput = {
  name: string;
  handedness: Handedness;
  playStyle: PlayStyle;
  strengths: string[];
  weaknesses: string[];
  notes?: string;
};

export type UpdateOpponentProfileInput = Partial<CreateOpponentProfileInput>;

export type Tournament = {
  id: string;
  name: string;
  category: string;
  surface: Surface;
  city?: string | null;
  startedAt: string;
};

export type CreateTournamentInput = {
  name: string;
  category: string;
  surface: Surface;
  city?: string;
  startedAt: string;
};

export type UpdateTournamentInput = Partial<CreateTournamentInput>;

/** {id, name, surface, createdAt} only — matchbook-old's lib/types.ts had stale
 * source/category/rank/capturedAt fields left over from a since-simplified backend model. */
export type RankingSnapshot = {
  id: string;
  name: string;
  surface: Surface;
  createdAt: string;
};

export type CreateRankingSnapshotInput = {
  name: string;
  surface: Surface;
};

export type UpdateRankingSnapshotInput = Partial<CreateRankingSnapshotInput>;

export type MatchSummary = {
  id: string;
  tournamentId?: string | null;
  opponentProfileId?: string | null;
  playedAt: string;
  result: MatchResult;
  score: string;
  surface: Surface;
  format: string;
  round?: string | null;
  focusAreas: string[];
  opponentNotes?: string | null;
  selfAssessment?: string | null;
  rankingContext?: string | null;
  opponentProfile?: {
    id: string;
    name: string;
    playStyle: PlayStyle;
    strengths: string[];
    weaknesses: string[];
  } | null;
  tournament?: {
    id: string;
    name: string;
  } | null;
};

export type CreateMatchInput = {
  tournamentId?: string;
  opponentProfileId?: string;
  playedAt: string;
  surface: Surface;
  format: string;
  round?: string;
  result: MatchResult;
  score: string;
  focusAreas: string[];
  opponentNotes?: string;
  selfAssessment?: string;
  rankingContext?: string;
};

export type UpdateMatchInput = Partial<CreateMatchInput>;

export type DashboardData = {
  summary: {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
  };
  styleBreakdown: Record<string, number>;
  surfaceBreakdown: Record<string, number>;
  topImprovementAreas: { label: string; count: number }[];
  latestRankings: RankingSnapshot[];
  recentMatches: MatchSummary[];
};

export type OpponentHistoryData = {
  opponent: OpponentProfile;
  summary: {
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    surfaces: Record<string, number>;
  };
  recurringFocusAreas: { label: string; count: number }[];
  matches: MatchSummary[];
};

export type StyleInsightItem = {
  style: string;
  matchCount: number;
  wins: number;
  losses: number;
  winRate: number;
  opponentCount: number;
  topFocusAreas: { label: string; count: number }[];
  commonStrengths: { label: string; count: number }[];
};

export type StyleInsightsData = {
  summary: {
    totalMatches: number;
    activeStyles: number;
    selectedSurface: string;
  };
  items: StyleInsightItem[];
};

export type AnalyticsData = {
  summary: {
    totalMatches: number;
    totalRankings: number;
    averageWinRate: number;
  };
  surfaceComparison: {
    surface: Surface;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
    topFocusAreas: { label: string; count: number }[];
  }[];
  monthlyTrend: {
    month: string;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
  }[];
  stylePerformance: {
    style: string;
    totalMatches: number;
    wins: number;
    losses: number;
    winRate: number;
  }[];
  rankingTrend: RankingSnapshot[];
  recommendations: { title: string; description: string }[];
};
