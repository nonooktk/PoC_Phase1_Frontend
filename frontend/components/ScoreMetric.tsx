/**
 * ScoreMetric.tsx — 3 軸スコア表示（◎○△×）
 * 仕様書 §9.4: GO/NO 判定は色 + アイコン + ラベル 3 要素（WCAG 2.1 AA）
 */

interface Props {
  axis: string;       // "外部環境" / "社内適合" / "組織体制"
  icon: string;       // 🌍 / 🏢 / 🤝
  score: string;      // ◎ / ○ / △ / × / －
  reason?: string;
  keyPoints?: string[];
}

const SCORE_META: Record<string, { color: string; bg: string; label: string; symbol: string }> = {
  '◎': { color: 'text-success-accent', bg: 'bg-teal-light', label: '非常に良い', symbol: '◎ (◎)' },
  '○': { color: 'text-brand-blue', bg: 'bg-surface-pricing-featured', label: '良好', symbol: '○ (○)' },
  '△': { color: 'text-yellow-dark', bg: 'bg-surface-yellow', label: '要注意', symbol: '△ (△)' },
  '×': { color: 'text-coral-dark', bg: 'bg-coral-light', label: '不可', symbol: '× (×)' },
  '－': { color: 'text-muted', bg: 'bg-surface', label: '評価不能', symbol: '－' },
};

export default function ScoreMetric({ axis, icon, score, reason, keyPoints }: Props) {
  const meta = SCORE_META[score] || SCORE_META['－'];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4 py-4">
      <div className={`rounded-lg p-4 ${meta.bg} flex flex-col items-center justify-center`}>
        <span className="text-body-sm text-slate mb-1" aria-hidden="true">
          {icon} {axis}
        </span>
        <span className={`text-stat-display ${meta.color} leading-none`} aria-hidden="true">
          {score}
        </span>
        <span className={`text-body-sm font-semibold ${meta.color}`}>{meta.label}</span>
        {/* スクリーンリーダー用: 色＋記号＋ラベルの3要素 */}
        <span className="sr-only">
          {axis}: {meta.symbol}（{meta.label}）
        </span>
      </div>
      <div>
        <h4 className="text-body-md font-semibold mb-1">💡 評価根拠</h4>
        <p className="text-body-sm text-charcoal whitespace-pre-line">{reason || '評価根拠がありません。'}</p>
        {keyPoints && keyPoints.length > 0 && (
          <ul className="mt-2 text-body-sm text-slate list-disc list-inside space-y-1">
            {keyPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
