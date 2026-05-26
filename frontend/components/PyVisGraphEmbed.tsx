/**
 * PyVisGraphEmbed.tsx — PyVis HTML を iframe srcDoc で埋め込み表示
 * mvp_streamlit/app.py の render_graph() を Next.js から呼び出す
 */
'use client';

import { useEffect, useState } from 'react';
import { fetchGraphHtml } from '@/lib/api';

export default function PyVisGraphEmbed({ nodeIds }: { nodeIds: string[] }) {
  const [html, setHtml] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const text = await fetchGraphHtml(nodeIds);
        if (!cancelled) setHtml(text);
      } catch (e: unknown) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nodeIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <p className="text-body-sm text-slate">グラフを生成中...</p>;
  if (error) return <p role="alert" className="text-coral-dark">グラフ取得失敗: {error}</p>;

  return (
    <div>
      <iframe
        srcDoc={html}
        title="関連ノードグラフ"
        className="w-full border border-hairline rounded-lg bg-canvas"
        style={{ height: 520 }}
        sandbox="allow-scripts allow-same-origin"
      />
      <p className="text-caption text-slate mt-2">
        🟡 検索ヒット　🟢 技術　🔵 人物　🟠 市場　🟣 過去 PJ
      </p>
    </div>
  );
}
