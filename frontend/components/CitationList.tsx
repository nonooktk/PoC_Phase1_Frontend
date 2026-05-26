/**
 * CitationList.tsx — 分析結果の引用元 (citations) を Simple 形式で表示
 *
 * 仕様書 SLI-5 (Citation 表示率 > 95%) / OE-13 (機密 3 段階) 対応。
 * 1 行 1 引用: [source バッジ] ドキュメント名 [機密レベルバッジ]
 * Phase 2 でクリック → スニペット展開 / グラフハイライト連携を追加予定。
 */
'use client';

import type { Citation } from '@/lib/api';

/** source は控えめなグレースケール、機密バッジと視覚的に競合させない */
function sourceChipClass(): string {
  return 'inline-flex items-center px-2 py-0.5 rounded-md text-caption font-medium bg-surface-pricing-featured text-ink border border-hairline whitespace-nowrap';
}

function sourceLabel(source: string): string {
  switch (source) {
    case 'internal':
      return '社内資料';
    case 'external':
      return '外部情報';
    case 'persons':
      return '人物';
    default:
      return source || '不明';
  }
}

function classificationBadgeClass(level: string): string {
  switch (level) {
    case '機密':
      return 'badge-tag-coral';
    case '社外秘':
      return 'badge-tag-yellow';
    case '一般':
    default:
      return 'badge-tag-purple';
  }
}

export default function CitationList({ citations }: { citations?: Citation[] }) {
  if (!citations || citations.length === 0) {
    return null;
  }
  return (
    <article className="card-base shadow-card" aria-label="引用元ドキュメント一覧">
      <header className="mb-3">
        <h3 className="text-heading-3">📚 参照元 ({citations.length} 件)</h3>
        <p className="text-caption text-slate mt-1">
          AI が分析時に参照した社内資料・外部情報・人物。機密レベルはあなたの閲覧上限以下のみ表示されます。
        </p>
      </header>
      <ul className="space-y-2">
        {citations.map((c, idx) => (
          <li
            key={`${c.id}-${idx}`}
            className="flex items-center gap-2 py-1 border-b border-hairline last:border-0"
          >
            <span className={sourceChipClass()}>{sourceLabel(c.source)}</span>
            <span className="text-body-sm flex-1 truncate" title={c.name}>
              {c.name}
            </span>
            <span
              className={classificationBadgeClass(c.classification_level)}
              aria-label={`機密レベル: ${c.classification_level}`}
            >
              {c.classification_level}
            </span>
            <span className="text-caption text-slate hidden md:inline">{c.id}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
