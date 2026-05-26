/**
 * EmptyState.tsx — 1-5 結果なし（社内資料に該当なし）
 * 仕様書 §9.2 1-5
 */

export default function EmptyState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="card-base shadow-card mt-6 text-center py-12">
      <p className="text-4xl mb-2" aria-hidden="true">🔍</p>
      <h2 className="text-heading-3 mb-2">関連データが見つかりませんでした</h2>
      <p className="text-body-md text-slate mb-6">
        社内で前例のない新規領域の可能性があります。<br />
        条件を変えて再分析するか、アイデアを保存して後で確認してください。
      </p>
      <div className="flex justify-center gap-3">
        <button onClick={onRetry} className="btn-primary">条件を変えて再分析</button>
        <button className="btn-secondary" disabled>このアイデアを保存（Phase 2）</button>
      </div>
    </section>
  );
}
