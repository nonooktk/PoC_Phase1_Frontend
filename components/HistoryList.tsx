/**
 * HistoryList.tsx — 1-6 分析履歴リスト
 * 仕様書 §9.2 1-6: 過去分析の一覧・絞込・統計サマリー
 */
'use client';

import type { AnalysisHistoryItem } from '@/lib/api';

const GO_NO_BADGE: Record<string, string> = {
  GO: 'badge-success',
  CONDITIONAL_GO: 'badge-tag-yellow',
  NO: 'badge-tag-coral',
};

export default function HistoryList({
  items,
  onLoadMore,
  hasMore,
}: {
  items: AnalysisHistoryItem[];
  onLoadMore?: () => void;
  hasMore?: boolean;
}) {
  if (!items.length) {
    return (
      <div className="card-base shadow-subtle text-center py-12">
        <p className="text-body-md text-slate">分析履歴はまだありません。</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((it) => {
        const cls = GO_NO_BADGE[it.go_no_flag || ''] || 'badge-tag-purple';
        return (
          <article key={it.id} className="card-base shadow-subtle">
            <header className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-body-md font-semibold truncate">
                #{it.id} — {it.market || '（市場未入力）'}
              </h3>
              {it.go_no_flag && <span className={cls}>{it.go_no_flag}</span>}
            </header>
            <p className="text-body-sm text-slate mb-1">
              <strong>アセット:</strong> {it.asset}
            </p>
            <p className="text-body-sm text-slate line-clamp-2">{it.idea_detail}</p>
            <footer className="mt-2 flex items-center justify-between">
              <time className="text-caption text-stone">
                {new Date(it.created_at).toLocaleString('ja-JP')}
              </time>
              <span className="text-caption text-slate">{it.status}</span>
            </footer>
          </article>
        );
      })}
      {hasMore && (
        <div className="text-center pt-2">
          <button onClick={onLoadMore} className="btn-secondary">
            さらに読み込む
          </button>
        </div>
      )}
    </div>
  );
}
