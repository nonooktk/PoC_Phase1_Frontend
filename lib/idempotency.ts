/**
 * idempotency.ts — Idempotency-Key (UUID v4) の生成・セッション保持
 * 仕様書 §7.2 準拠
 */

export function uuidv4(): string {
  // crypto.randomUUID が使えるブラウザはそれを使う
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as Crypto & { randomUUID: () => string }).randomUUID();
  }
  // フォールバック（古いブラウザ向け）
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const STORAGE_KEY = 'tech0-idempotency-current';

/** 現在の Idempotency-Key を取得（なければ生成して保存） */
export function getOrCreateIdempotencyKey(): string {
  if (typeof window === 'undefined') return uuidv4();
  let key = sessionStorage.getItem(STORAGE_KEY);
  if (!key) {
    key = uuidv4();
    sessionStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}

/** 新しい Idempotency-Key を強制発行（再分析リクエスト用） */
export function rotateIdempotencyKey(): string {
  const key = uuidv4();
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, key);
  }
  return key;
}
