/**
 * session.ts — ログインセッション (sessionStorage) のヘルパ
 *
 * Phase 1 はモック認証。sessionStorage に user_id を保持し、
 * API リクエスト時に X-User-Id ヘッダーへ自動付与する。
 *
 * Phase 2 で Entra ID JWT / Cookie へ差し替える際は本ファイルの
 * 実装だけ書き換えれば、呼び出し側 (api.ts / AuthGuard) は無変更で済む。
 */

const KEY = 'tech0-user-id';

export function getUserId(): number | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function setUserId(id: number): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KEY, String(id));
}

export function clearUserId(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(KEY);
}

export function isLoggedIn(): boolean {
  return getUserId() !== null;
}
