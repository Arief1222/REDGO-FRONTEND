
import { useState, useEffect } from 'react';

const DAILY_FREE_LIMIT = 5;
const STORAGE_PREFIX = "rg_quota";

export function isAdminRole(roleName?: string): boolean {
  const role = roleName?.toLowerCase();
  return role === 'admin' || role === 'superadmin';
}

function getQuotaKey(mode: string, topic?: string, subMode?: string): string {
  if (topic && subMode) return `${STORAGE_PREFIX}:${mode}:${topic}:${subMode}`;
  return `${STORAGE_PREFIX}:${mode}`;
}

function getQuota(key: string): { resetAt: number; count: number } {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.resetAt && Date.now() < parsed.resetAt) {
        return parsed;
      }
    }
  } catch { }
  const fresh = { resetAt: Date.now() + 24 * 60 * 60 * 1000, count: 0 };
  localStorage.setItem(key, JSON.stringify(fresh));
  return fresh;
}

function saveQuota(key: string, count: number, resetAt: number) {
  localStorage.setItem(key, JSON.stringify({ resetAt, count }));
}

export function getRemainingQuota(
  isPremium: boolean,
  mode: string,
  topic?: string,
  subMode?: string
): number {
  if (isPremium) return Infinity;
  const key = getQuotaKey(mode, topic, subMode);
  const q = getQuota(key);
  return Math.max(0, DAILY_FREE_LIMIT - q.count);
}

export function consumeQuota(
  isPremium: boolean,
  mode: string,
  topic?: string,
  subMode?: string
): boolean {
  if (isPremium) return true;
  const key = getQuotaKey(mode, topic, subMode);
  const q = getQuota(key);
  if (q.count >= DAILY_FREE_LIMIT) return false;
  saveQuota(key, q.count + 1, q.resetAt);
  return true;
}

export function msUntilReset(mode: string, topic?: string, subMode?: string): number {
  const key = getQuotaKey(mode, topic, subMode);
  const q = getQuota(key);
  return Math.max(0, q.resetAt - Date.now());
}

export function resetCountdown(mode: string, topic?: string, subMode?: string): string {
  const ms = msUntilReset(mode, topic, subMode);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  return `${h}j ${m}m ${s}d`;
}

export function useResetCountdown(mode: string, topic?: string, subMode?: string): string {
  const [countdown, setCountdown] = useState(resetCountdown(mode, topic, subMode));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(resetCountdown(mode, topic, subMode));
    }, 1_000);
    return () => clearInterval(interval);
  }, [mode, topic, subMode]);

  return countdown;
}