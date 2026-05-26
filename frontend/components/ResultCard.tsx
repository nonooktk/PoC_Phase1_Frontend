/**
 * ResultCard.tsx — 個別提案カード（パステル feature card）
 * 仕様書 §9.2 1-4: 3 カテゴリ（過去失敗 / 特許・技術 / 組織横断）に対応
 */

import type { Proposal } from '@/lib/api';

const VARIANT_CLASS: Record<string, string> = {
  yellow: 'card-feature-yellow',
  coral: 'card-feature-coral',
  teal: 'card-feature-teal',
  rose: 'card-feature-rose',
};

export default function ResultCard({
  proposal,
  index,
  variant = 'teal',
}: {
  proposal: Proposal;
  index: number;
  variant?: keyof typeof VARIANT_CLASS;
}) {
  const cls = VARIANT_CLASS[variant] || VARIANT_CLASS.teal;
  return (
    <article className={cls}>
      <header className="mb-3">
        <p className="text-caption font-semibold opacity-70">提案 {index + 1}</p>
        <h3 className="text-heading-4 mt-1">{proposal.title || '無題の提案'}</h3>
      </header>
      <p className="text-body-sm mb-3 whitespace-pre-line">{proposal.summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <Metric label="タイミング評価" score={proposal.timing_score} reason={proposal.timing_reason} />
        <Metric label="技術適合性" score={proposal.tech_fit_score} reason={proposal.tech_fit_reason} />
      </div>

      {proposal.bottleneck && (
        <div className="bg-canvas/70 rounded-md p-3 mb-2">
          <p className="text-body-sm">
            <strong>最大のボトルネック:</strong> {proposal.bottleneck}
          </p>
        </div>
      )}
      {proposal.bottleneck_solution && (
        <div className="bg-canvas/70 rounded-md p-3 mb-3">
          <p className="text-body-sm">
            <strong>解決策:</strong> {proposal.bottleneck_solution}
          </p>
        </div>
      )}

      {proposal.next_actions && proposal.next_actions.length > 0 && (
        <div>
          <h4 className="text-body-md font-semibold mb-1">🏃 次の具体的なアクション</h4>
          <ul className="text-body-sm space-y-1 list-disc list-inside">
            {proposal.next_actions.map((a, i) => (
              <li key={i}>
                <strong>{a.person}:</strong> {a.action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function Metric({ label, score, reason }: { label: string; score?: string; reason?: string }) {
  return (
    <div className="bg-canvas/70 rounded-md p-3">
      <p className="text-caption text-charcoal">{label}</p>
      <p className="text-heading-4 font-semibold">{score || '-'}</p>
      {reason && <p className="text-caption text-slate mt-1">{reason}</p>}
    </div>
  );
}
