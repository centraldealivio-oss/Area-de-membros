/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserSession, AccessTier, TokenInfo, UnlockedPermissions } from '../types';

export const PARADISE_CHECKOUT_URL = 'https://mente.centraldealivio.com.br';

const SESSION_KEY = 'ade_members_session_v1';
const COMPLETED_TOPICS_KEY = 'ade_completed_topics_v1';
const REFLECTION_NOTES_KEY = 'ade_reflection_notes_v1';

export function computePermissions(tokenRaw: string, tierRaw?: AccessTier): UnlockedPermissions {
  const token = (tokenRaw || '').trim().toUpperCase();
  const tier = tierRaw || 'standard';

  // SUPREMO or VIP (Everything Unlocked)
  if (
    tier === 'supremo' ||
    tier === 'vip_upsell' ||
    token.includes('SUPREMO') ||
    token.includes('MASTER') ||
    token.includes('VIP') ||
    token.includes('UPSELL')
  ) {
    return {
      mainBook: true,
      bonus1: true,
      bonus2: true,
      bonus3: true,
      vipCommunity: true,
      isSupremo: true
    };
  }

  // All Bonuses tier
  if (tier === 'all_bonuses' || token.includes('ALL-BONUSES') || token.includes('TODOS-BONUS')) {
    return {
      mainBook: true,
      bonus1: true,
      bonus2: true,
      bonus3: true,
      vipCommunity: false,
      isSupremo: false
    };
  }

  // Specific Bonus or Combo Tokens
  const isBonus1 =
    tier === 'bonus_1' ||
    token.includes('BONUS1') ||
    token.includes('BONUS-1') ||
    token.includes('BPM100') ||
    token.includes('-B1-') ||
    token.includes('-B1') ||
    token.startsWith('B1-');

  const isBonus2 =
    tier === 'bonus_2' ||
    token.includes('BONUS2') ||
    token.includes('BONUS-2') ||
    token.includes('GATILHO') ||
    token.includes('RAIOX') ||
    token.includes('-B2-') ||
    token.includes('-B2') ||
    token.startsWith('B2-');

  const isBonus3 =
    tier === 'bonus_3' ||
    token.includes('BONUS3') ||
    token.includes('BONUS-3') ||
    token.includes('VINCULO') ||
    token.includes('BLINDAGEM') ||
    token.includes('-B3-') ||
    token.includes('-B3') ||
    token.startsWith('B3-');

  return {
    mainBook: true,
    bonus1: isBonus1,
    bonus2: isBonus2,
    bonus3: isBonus3,
    vipCommunity: false,
    isSupremo: false
  };
}

// Preset demo tokens for instant manual testing or showcase
export const DEMO_TOKENS: Record<string, TokenInfo> = {
  'PARADISE-SUPREMO-9999': {
    token: 'PARADISE-SUPREMO-9999',
    tier: 'supremo',
    customerName: 'Membro SUPREMO Master',
    customerEmail: 'supremo@exemplo.com',
    createdAt: new Date().toISOString(),
    permissions: computePermissions('PARADISE-SUPREMO-9999', 'supremo')
  },
  'TOKEN-BONUS1-BPM100': {
    token: 'TOKEN-BONUS1-BPM100',
    tier: 'bonus_1',
    customerName: 'Comprador (Principal + Bônus 1)',
    customerEmail: 'bonus1@exemplo.com',
    createdAt: new Date().toISOString(),
    permissions: computePermissions('TOKEN-BONUS1-BPM100', 'bonus_1')
  },
  'TOKEN-BONUS2-GATILHO': {
    token: 'TOKEN-BONUS2-GATILHO',
    tier: 'bonus_2',
    customerName: 'Comprador (Principal + Bônus 2)',
    customerEmail: 'bonus2@exemplo.com',
    createdAt: new Date().toISOString(),
    permissions: computePermissions('TOKEN-BONUS2-GATILHO', 'bonus_2')
  },
  'TOKEN-BONUS3-VINCULO': {
    token: 'TOKEN-BONUS3-VINCULO',
    tier: 'bonus_3',
    customerName: 'Comprador (Principal + Bônus 3)',
    customerEmail: 'bonus3@exemplo.com',
    createdAt: new Date().toISOString(),
    permissions: computePermissions('TOKEN-BONUS3-VINCULO', 'bonus_3')
  },
  'TOKEN-BONUS12-COMBO': {
    token: 'TOKEN-BONUS12-COMBO',
    tier: 'standard',
    customerName: 'Comprador (Principal + Bônus 1 e 2)',
    customerEmail: 'combo12@exemplo.com',
    createdAt: new Date().toISOString(),
    permissions: computePermissions('TOKEN-BONUS12-B1-B2', 'standard')
  },
  'TOKEN-ALL-BONUSES': {
    token: 'TOKEN-ALL-BONUSES',
    tier: 'all_bonuses',
    customerName: 'Comprador (Principal + Bônus 1, 2 e 3)',
    customerEmail: 'allbonuses@exemplo.com',
    createdAt: new Date().toISOString(),
    permissions: computePermissions('TOKEN-ALL-BONUSES', 'all_bonuses')
  },
  'PARADISE-STD-1234': {
    token: 'PARADISE-STD-1234',
    tier: 'standard',
    customerName: 'Comprador Somente Produto Principal',
    customerEmail: 'comprador@exemplo.com',
    createdAt: new Date().toISOString(),
    permissions: computePermissions('PARADISE-STD-1234', 'standard')
  }
};

export async function validateTokenOnlineOrLocal(rawToken: string): Promise<UserSession | null> {
  const cleanToken = rawToken.trim().toUpperCase();

  if (!cleanToken) return null;

  // Try server API first
  try {
    const response = await fetch(`/api/validate-token?token=${encodeURIComponent(cleanToken)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.valid && data.session) {
        const s = data.session as UserSession;
        return {
          ...s,
          permissions: s.permissions || computePermissions(s.token, s.tier)
        };
      }
    }
  } catch (err) {
    console.warn('Backend validation endpoint offline, falling back to local verification:', err);
  }

  // Local fallback check
  const demoMatch = DEMO_TOKENS[cleanToken];
  if (demoMatch) {
    const permissions = demoMatch.permissions || computePermissions(demoMatch.token, demoMatch.tier);
    return {
      token: demoMatch.token,
      tier: demoMatch.tier,
      customerName: demoMatch.customerName || 'Cliente Paradise',
      customerEmail: demoMatch.customerEmail || 'cliente@paradise.com',
      authenticatedAt: new Date().toISOString(),
      permissions
    };
  }

  // Pattern check: SUPREMO
  if (cleanToken.includes('SUPREMO') || cleanToken.includes('MASTER')) {
    return {
      token: cleanToken,
      tier: 'supremo',
      customerName: 'Cliente SUPREMO Master',
      customerEmail: 'supremo@paradisepags.com',
      authenticatedAt: new Date().toISOString(),
      permissions: computePermissions(cleanToken, 'supremo')
    };
  }

  // Pattern check: Bônus 1 specifically
  if (cleanToken.includes('BONUS1') || cleanToken.includes('BONUS-1') || cleanToken.includes('BPM100')) {
    return {
      token: cleanToken,
      tier: 'bonus_1',
      customerName: 'Cliente Bônus 1 (100 BPM)',
      customerEmail: 'bonus1@paradisepags.com',
      authenticatedAt: new Date().toISOString(),
      permissions: computePermissions(cleanToken, 'bonus_1')
    };
  }

  // Pattern check: Bônus 2 specifically
  if (cleanToken.includes('BONUS2') || cleanToken.includes('BONUS-2') || cleanToken.includes('GATILHO') || cleanToken.includes('RAIOX')) {
    return {
      token: cleanToken,
      tier: 'bonus_2',
      customerName: 'Cliente Bônus 2 (Raio-X)',
      customerEmail: 'bonus2@paradisepags.com',
      authenticatedAt: new Date().toISOString(),
      permissions: computePermissions(cleanToken, 'bonus_2')
    };
  }

  // Pattern check: Bônus 3 specifically
  if (cleanToken.includes('BONUS3') || cleanToken.includes('BONUS-3') || cleanToken.includes('VINCULO') || cleanToken.includes('BLINDAGEM')) {
    return {
      token: cleanToken,
      tier: 'bonus_3',
      customerName: 'Cliente Bônus 3 (Blindagem)',
      customerEmail: 'bonus3@paradisepags.com',
      authenticatedAt: new Date().toISOString(),
      permissions: computePermissions(cleanToken, 'bonus_3')
    };
  }

  // Pattern check: VIP / UPSELL (All Bonuses + VIP Community)
  if (
    cleanToken.includes('PARADISE-VIP') ||
    cleanToken.startsWith('PARADISE-VIP') ||
    cleanToken.startsWith('VIP-') ||
    cleanToken.includes('UPSELL') ||
    cleanToken.includes('VIP')
  ) {
    return {
      token: cleanToken,
      tier: 'vip_upsell',
      customerName: 'Cliente VIP Paradise',
      customerEmail: 'cliente.vip@paradisepags.com',
      authenticatedAt: new Date().toISOString(),
      permissions: computePermissions(cleanToken, 'vip_upsell')
    };
  }

  // Generic valid token (starts with PARADISE- or ADE- or length >= 6)
  if (cleanToken.startsWith('PARADISE-') || cleanToken.startsWith('ADE-') || cleanToken.length >= 6) {
    return {
      token: cleanToken,
      tier: 'standard',
      customerName: 'Membro Autorizado',
      customerEmail: 'membro@paradise.com',
      authenticatedAt: new Date().toISOString(),
      permissions: computePermissions(cleanToken, 'standard')
    };
  }

  return null;
}

export function redeemAdditionalToken(
  currentSession: UserSession,
  newTokenRaw: string
): { updatedSession: UserSession; newlyUnlockedMsg: string } | null {
  const newPermissions = computePermissions(newTokenRaw);
  const currentPerms = currentSession.permissions || computePermissions(currentSession.token, currentSession.tier);

  // Merge permissions
  const mergedPerms: UnlockedPermissions = {
    mainBook: true,
    bonus1: currentPerms.bonus1 || newPermissions.bonus1,
    bonus2: currentPerms.bonus2 || newPermissions.bonus2,
    bonus3: currentPerms.bonus3 || newPermissions.bonus3,
    vipCommunity: currentPerms.vipCommunity || newPermissions.vipCommunity,
    isSupremo: currentPerms.isSupremo || newPermissions.isSupremo
  };

  let newTier: AccessTier = currentSession.tier;
  let newlyUnlockedMsg = 'Bônus liberado com sucesso!';

  if (mergedPerms.isSupremo) {
    newTier = 'supremo';
    newlyUnlockedMsg = '👑 TOKEN SUPREMO ATIVADO! Todos os Bônus e a Comunidade VIP foram 100% liberados!';
  } else if (mergedPerms.bonus1 && mergedPerms.bonus2 && mergedPerms.bonus3 && mergedPerms.vipCommunity) {
    newTier = 'vip_upsell';
    newlyUnlockedMsg = '💎 Todos os Bônus VIP e a Comunidade foram ativados!';
  } else if (newPermissions.bonus1) {
    newlyUnlockedMsg = '⚡ Bônus 1 (Protocolo 100 BPM) liberado!';
  } else if (newPermissions.bonus2) {
    newlyUnlockedMsg = '🎯 Bônus 2 (Raio-X do Gatilho) liberado!';
  } else if (newPermissions.bonus3) {
    newlyUnlockedMsg = '🛡️ Bônus 3 (Blindagem do Vínculo) liberado!';
  }

  const updatedSession: UserSession = {
    ...currentSession,
    tier: newTier,
    permissions: mergedPerms
  };

  saveSession(updatedSession);
  return { updatedSession, newlyUnlockedMsg };
}

export function getStoredSession(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function saveSession(session: UserSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save session:', e);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}

export function getTokenFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('token') || params.get('access_token') || params.get('key') || params.get('code');
}

// Completed topics state helpers
export function getCompletedTopics(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETED_TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleTopicCompleted(topicId: string): string[] {
  const current = getCompletedTopics();
  let updated: string[];
  if (current.includes(topicId)) {
    updated = current.filter(id => id !== topicId);
  } else {
    updated = [...current, topicId];
  }
  try {
    localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save completion state:', e);
  }
  return updated;
}

// Reflection Notes helpers
export function getStoredNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(REFLECTION_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveNote(topicId: string, content: string): Record<string, string> {
  const current = getStoredNotes();
  const updated = { ...current, [topicId]: content };
  try {
    localStorage.setItem(REFLECTION_NOTES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save note:', e);
  }
  return updated;
}
