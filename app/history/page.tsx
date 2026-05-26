/**
 * app/history/page.tsx — 1-6 分析履歴ダッシュボード
 * 仕様書 §9.2 1-6 / OE-15: ファセット 2 軸対応
 */
'use client';

import { useEffect, useState } from 'react';

import FacetFilter from '@/components/FacetFilter';
import HistoryList from '@/components/HistoryList';
import { fetchMe, listAnalyses, type AnalysisHistoryItem, type MeResponse } from '@/lib/api';

export default function HistoryPage() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);

  const load = async (reset = false) => {
    try {
      setLoading(true);
      const res = await listAnalyses(20, reset ? undefined : cursor);
      setItems((prev) => (reset ? res.data : [...prev, ...res.data]));
      setCursor(res.next_cursor);
      setHasMore(res.has_more);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => setMe(null));
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-heading-1">分析履歴</h1>
        <p className="text-subtitle text-slate mt-1">
          過去の分析結果を一覧で確認できます。事業部・機密レベルで絞り込み可能。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <FacetFilter
          allowedLevels={me?.allowed_levels}
          onApply={(deptIds, classification) => {
            // Phase 1 では履歴 API のファセットは未実装 (検索 API のみ実装済み)。
            // Phase 2 で list_analyses にも dept_ids / classification を渡せるよう拡張予定。
            console.log('filter (Phase 2 で API 連携):', deptIds, classification);
          }}
        />

        <div>
          {error && (
            <div role="alert" className="card-base bg-brand-red border-brand-red-dark text-coral-dark mb-3">
              ⚠ {error}
            </div>
          )}
          {loading && items.length === 0 ? (
            <p className="text-body-sm text-slate">読み込み中...</p>
          ) : (
            <HistoryList items={items} onLoadMore={() => load(false)} hasMore={hasMore} />
          )}
        </div>
      </div>
    </div>
  );
}
