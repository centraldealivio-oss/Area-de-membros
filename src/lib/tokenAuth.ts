/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserSession, AccessTier, TokenInfo } from '../types';

export const PARADISE_CHECKOUT_URL = 'https://centraldealivio.com.br';

const SESSION_KEY = 'ade_members_session_v1';
const COMPLETED_TOPICS_KEY = 'ade_completed_topics_v1';
const REFLECTION_NOTES_KEY = 'ade_reflection_notes_v1';

// Preset demo tokens for instant manual testing or showcase
export const DEMO_TOKENS: Record<string, TokenInfo> = {
  'PARADISE-VIP-8888': {
    token: 'PARADISE-VIP-8888',
    tier: 'vip_upsell',
    customerName: 'Cliente VIP Paradise',
    customerEmail: 'comprador.vip@exemplo.com',
    createdAt: new Date().toISOString()
  },
  'VIP-UPSELL-9999': {
    token: 'VIP-UPSELL-9999',
    tier: 'vip_upsell',
    customerName: 'Comprador VIP (Área Fantasma Ativa)',
    customerEmail: 'vip@exemplo.com',
    createdAt: new Date().toISOString()
  },
  'DEMO-ADE-1001': {
    token: 'DEMO-ADE-1001',
    tier: 'standard',
    customerName: 'Aluno Antes da Explosão',
    customerEmail: 'aluno@exemplo.com',
    createdAt: new Date().toISOString()
  },
  'PARADISE-STD-1234': {
    token: 'PARADISE-STD-1234',
    tier: 'standard',
    customerName: 'Cliente Padrão Paradise',
    customerEmail: 'comprador@exemplo.com',
    createdAt: new Date().toISOString()
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
        return data.session as UserSession;
      }
    }
  } catch (err) {
    console.warn('Backend validation endpoint offline, falling back to local verification:', err);
  }

  // Local fallback check
  const demoMatch = DEMO_TOKENS[cleanToken];
  if (demoMatch) {
    return {
      token: demoMatch.token,
      tier: demoMatch.tier,
      customerName: demoMatch.customerName || 'Cliente Paradise',
      customerEmail: demoMatch.customerEmail || 'cliente@paradise.com',
      authenticatedAt: new Date().toISOString()
    };
  }

  // Pattern check: if token contains PARADISE-VIP, VIP-, or UPSELL, grant VIP access (unlocks both Área Fantasma & Comunidade VIP)
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
      authenticatedAt: new Date().toISOString()
    };
  }

  // Generic valid token (starts with PARADISE- or ADE- or length >= 6)
  if (cleanToken.startsWith('PARADISE-') || cleanToken.startsWith('ADE-') || cleanToken.length >= 6) {
    return {
      token: cleanToken,
      tier: 'standard',
      customerName: 'Membro Autorizado',
      customerEmail: 'membro@paradise.com',
      authenticatedAt: new Date().toISOString()
    };
  }

  return null;
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
