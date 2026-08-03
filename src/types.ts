/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AccessTier =
  | 'standard'
  | 'bonus_1'
  | 'bonus_2'
  | 'bonus_3'
  | 'all_bonuses'
  | 'vip_upsell'
  | 'supremo';

export interface UnlockedPermissions {
  mainBook: boolean;
  bonus1: boolean;
  bonus2: boolean;
  bonus3: boolean;
  vipCommunity: boolean;
  isSupremo: boolean;
}

export interface TokenInfo {
  token: string;
  tier: AccessTier;
  customerName?: string;
  customerEmail?: string;
  createdAt: string;
  isUsed?: boolean;
  permissions?: UnlockedPermissions;
}

export interface UserSession {
  token: string;
  tier: AccessTier;
  customerName: string;
  customerEmail: string;
  authenticatedAt: string;
  permissions?: UnlockedPermissions;
}

export interface Topic {
  id: string;
  number: number;
  title: string;
  shortSummary: string;
  durationMinutes: number;
  audioUrl?: string;
  transcript: string;
  neuroscienceBreakdown: {
    brainRegion: string; // e.g. "Amígdala Cerebral & Córtex Pré-Frontal"
    chemicalProcess: string; // e.g. "Liberação de Cortisol e Adrenalina"
    explanation: string;
  };
  practicalAction: {
    action: string;
    howToApply: string;
    avoidThis: string;
  };
  reflectionPrompt: string;
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  topics: Topic[];
}

export interface Bonus {
  id: string;
  number: number;
  title: string;
  badge: string;
  subtitle: string;
  tagline: string;
  coverImage: string;
  description: string;
  highlights: string[];
}

export interface NoteEntry {
  topicId: string;
  content: string;
  updatedAt: string;
}

export interface TriggerQuizResult {
  primaryPattern: 'ansioso' | 'evitativo' | 'desorganizado' | 'trava';
  score: Record<string, number>;
  advice: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  isAnonymous?: boolean;
  content: string;
  createdAt: string;
  likesCount: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  isAnonymous?: boolean;
  category: 'neurociencia' | 'bpm100' | 'scripts' | 'relatos' | 'geral';
  title: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isPinned?: boolean;
  comments: CommunityComment[];
}
