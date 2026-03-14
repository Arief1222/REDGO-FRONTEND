import { useState, useEffect } from 'react';

const DAILY_FREE_LIMIT = 5;
const STORAGE_QUOTA_KEY = "rg_daily_quota";

export const LOCKED_TOPICS = [
  "marketing",
  "product_development",
  "market_analyst",
  "content_plan",
] as const;

export type LockedTopic = typeof LOCKED_TOPICS[number];

export function isAdminRole(roleName?: string): boolean {
  const role = roleName?.toLowerCase();
  return role === 'admin' || role === 'superadmin';
}

function getQuota(): { resetAt: number; count: number } {
  try {
    const raw = localStorage.getItem(STORAGE_QUOTA_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.resetAt && Date.now() < parsed.resetAt) {
        return parsed;
      }
    }
  } catch {}
  // Buat baru DAN langsung simpan
  const fresh = { resetAt: Date.now() + 24 * 60 * 60 * 1000, count: 0 };
  localStorage.setItem(STORAGE_QUOTA_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveQuota(count: number, resetAt: number) {
  localStorage.setItem(STORAGE_QUOTA_KEY, JSON.stringify({ resetAt, count }));
}

export function getRemainingQuota(isPremium: boolean): number {
  if (isPremium) return Infinity;
  const q = getQuota();
  return Math.max(0, DAILY_FREE_LIMIT - q.count);
}

export function consumeQuota(isPremium: boolean): boolean {
  if (isPremium) return true;
  const q = getQuota();
  if (q.count >= DAILY_FREE_LIMIT) return false;
  saveQuota(q.count + 1, q.resetAt);
  return true;
}

export function msUntilReset(): number {
  const q = getQuota();
  return Math.max(0, q.resetAt - Date.now());
}

export function resetCountdown(): string {
  const ms = msUntilReset();
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  return `${h}j ${m}m ${s}d`;
}

// ✅ Hook reactive — taruh paling bawah setelah resetCountdown
export function useResetCountdown(): string {
  const [countdown, setCountdown] = useState(resetCountdown());

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(resetCountdown());
    }, 1_000); // ✅ tiap detik
    return () => clearInterval(interval);
  }, []);

  return countdown;
}