/**
 * LoadingPanel.tsx — 1-3 分析ローディング画面
 * 仕様書 §9.2 1-3: 4 ステップ進行（解析→失敗照合→特許→組織）+ プログレスバー
 * §9.4: role="status" + aria-live="polite"
 */
'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  '📑 入力内容を解析中...',
  '🔍 過去失敗パターンを照合中...',
  '🧪 特許・技術の自動照合を実行中...',
  '👥 組織横断・キーマン情報を参照中...',
];

export default function LoadingPanel() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 30 秒のうちで段階的に進める（実際の完了は外部で制御）
    const interval = setInterval(() => {
      setProgress((p) => (p < STEPS.length - 1 ? p + 1 : p));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="分析中です。しばらくお待ちください"
      className="card-base shadow-card mt-6"
    >
      <h2 className="text-heading-3 mb-2">🧠 AI が多角的に分析・評価中...</h2>
      <p className="text-body-sm text-slate mb-4">
        社内資料・特許・過去事例を横断検索しています（30〜60 秒）
      </p>

      <ol className="space-y-2 mb-4">
        {STEPS.map((label, i) => {
          const done = i < progress;
          const current = i === progress;
          return (
            <li key={i} className="flex items-center gap-3">
              <span
                className={`inline-flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? 'bg-success-accent text-on-primary'
                    : current
                    ? 'bg-brand-yellow text-primary animate-pulse'
                    : 'bg-hairline text-muted'
                }`}
                aria-label={done ? '完了' : current ? '実行中' : '待機'}
              >
                {done ? '✓' : i + 1}
              </span>
              <span className={done ? 'text-slate line-through' : current ? 'text-ink font-medium' : 'text-muted'}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {/* プログレスバー */}
      <div
        className="w-full h-2 bg-surface rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(((progress + 1) / STEPS.length) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-brand-blue transition-all duration-1000"
          style={{ width: `${((progress + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </section>
  );
}
