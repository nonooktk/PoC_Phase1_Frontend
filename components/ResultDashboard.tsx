/**
 * ResultDashboard.tsx — 1-4 分析結果ダッシュボード
 * 仕様書 §9.2 1-4: 評価グレード + ResultCard + ファセット
 * §9.4: WCAG 2.1 A 準拠
 */
'use client';

import { useState } from 'react';
import type { AnalysisResponse } from '@/lib/api';
import { postFeedback } from '@/lib/api';
import CitationList from './CitationList';
import ScoreMetric from './ScoreMetric';
import ThreeCTabs from './ThreeCTabs';
import ResultCard from './ResultCard';
import PyVisGraphEmbed from './PyVisGraphEmbed';

type TabKey = 'proposals' | 'three_c' | 'graph';

const GO_NO_LABEL: Record<string, { label: string; color: string; icon: string; sr: string }> = {
  GO: { label: 'GO', color: 'bg-success-accent text-on-primary', icon: '✓', sr: 'GO（投資推奨）' },
  CONDITIONAL_GO: {
    label: '条件付き GO',
    color: 'bg-brand-yellow text-primary',
    icon: '⚠',
    sr: '条件付きGO（要注意）',
  },
  NO: { label: 'NO', color: 'bg-brand-red text-coral-dark', icon: '✕', sr: 'NO（投資不可）' },
};

const VARIANTS: ('yellow' | 'coral' | 'teal' | 'rose')[] = ['yellow', 'coral', 'teal', 'rose'];

export default function ResultDashboard({
  result,
  onReset,
}: {
  result: AnalysisResponse;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<TabKey>('proposals');
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const stage1 = result.stage1 || {};
  const stage2 = result.stage2 || {};
  const goNo = result.go_no || 'GO';
  const goMeta = GO_NO_LABEL[goNo] || GO_NO_LABEL.GO;

  const handleRate = async (value: number) => {
    setRating(value);
    try {
      await postFeedback(result.analysis_id, value);
      setFeedbackSent(true);
    } catch (e) {
      console.error('feedback failed', e);
    }
  };

  return (
    <section className="space-y-6 mt-6">
      {/* ===== エグゼクティブサマリー ===== */}
      <article className="card-base shadow-card">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-3">
          <div>
            <h2 className="text-heading-2">🎯 エグゼクティブ・サマリー</h2>
            <p className="text-caption text-slate">
              ※ 本 AI 判定は、市場性・技術適合性・組織体制の 3 軸に基づき、初期投資の妥当性を評価したものです。
            </p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-lg font-bold ${goMeta.color}`}>
            <span aria-hidden="true">{goMeta.icon}</span>
            <span>{goMeta.label}</span>
            <span className="sr-only">{goMeta.sr}</span>
          </span>
        </header>
        <div className="bg-surface-yellow border border-yellow-light rounded-md p-4">
          <p className="text-body-md whitespace-pre-line">
            {stage2.approver_summary || 'サマリー情報が生成されませんでした。'}
          </p>
        </div>
      </article>

      {/* ===== 3 軸スコア ===== */}
      <article className="card-base shadow-card">
        <h3 className="text-heading-3 mb-2">3 軸評価と根拠詳細</h3>
        <ScoreMetric axis="外部環境" icon="🌍" score={stage1.external?.score || '－'}
          reason={stage1.external?.reason} keyPoints={stage1.external?.key_points} />
        <div className="hairline" />
        <ScoreMetric axis="社内適合" icon="🏢" score={stage1.internal?.score || '－'}
          reason={stage1.internal?.reason} keyPoints={stage1.internal?.key_points} />
        <div className="hairline" />
        <ScoreMetric axis="組織体制" icon="🤝" score={stage1.org?.score || '－'}
          reason={stage1.org?.reason} keyPoints={stage1.org?.key_points} />
      </article>

      {/* ===== タブ ===== */}
      <article className="card-base shadow-card">
        <nav role="tablist" aria-label="分析結果タブ" className="flex border-b border-hairline mb-4">
          {[
            { key: 'proposals', label: '💡 事業提案・アクション' },
            { key: 'three_c', label: '📊 3C 分析' },
            { key: 'graph', label: '🌐 関連ノードグラフ' },
          ].map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              aria-controls={`tabpanel-${t.key}`}
              className={`px-4 py-2 text-body-sm font-medium ${
                tab === t.key
                  ? 'text-brand-blue border-b-2 border-brand-blue'
                  : 'text-slate hover:text-ink'
              }`}
              onClick={() => setTab(t.key as TabKey)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'proposals' && (
          <div id="tabpanel-proposals" role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stage2.proposals && stage2.proposals.length > 0 ? (
              stage2.proposals.map((p, i) => (
                <ResultCard key={i} proposal={p} index={i} variant={VARIANTS[i % VARIANTS.length]} />
              ))
            ) : (
              <p className="text-body-sm text-slate">ピボット提案はありません。</p>
            )}
          </div>
        )}

        {tab === 'three_c' && (
          <div id="tabpanel-three_c" role="tabpanel">
            <ThreeCTabs tier2={stage2.tier2} />
          </div>
        )}

        {tab === 'graph' && (
          <div id="tabpanel-graph" role="tabpanel">
            <h3 className="text-heading-4 mb-2">関連情報ネットワーク</h3>
            <PyVisGraphEmbed nodeIds={result.related_node_ids || []} />
          </div>
        )}
      </article>

      {/* ===== 参照元 (引用 / Citation) — SLI-5 / OE-13 ===== */}
      <CitationList citations={result.citations} />

      {/* ===== CSAT フィードバックバナー (OE-11) ===== */}
      <article className="card-base shadow-subtle">
        <h3 className="text-body-md font-semibold mb-2">分析結果はいかがでしたか？</h3>
        {feedbackSent ? (
          <p className="text-body-sm text-success-accent">フィードバックを受け付けました。ありがとうございます。</p>
        ) : (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => handleRate(n)}
                aria-label={`${n} / 5 で評価する`}
                className={`text-2xl ${rating && n <= rating ? 'text-brand-yellow' : 'text-muted'}`}
              >
                ★
              </button>
            ))}
            <span className="text-caption text-slate ml-2">星評価 1〜5</span>
          </div>
        )}
      </article>

      {/* ===== アクション ===== */}
      <div className="flex flex-wrap gap-3">
        <button onClick={onReset} className="btn-secondary">条件を変えて再分析</button>
        <button className="btn-primary" disabled>PDF レポート出力（Phase 2）</button>
      </div>
    </section>
  );
}
