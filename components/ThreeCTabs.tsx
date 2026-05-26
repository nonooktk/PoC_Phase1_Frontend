/**
 * ThreeCTabs.tsx — 3C 分析（Customer / Competitor / Company）
 * mvp_streamlit/app.py の Tier2 タブを再実装
 */

import type { Tier2 } from '@/lib/api';

export default function ThreeCTabs({ tier2 }: { tier2?: Tier2 }) {
  if (!tier2) return <p className="text-body-sm text-slate">3C 分析データがありません。</p>;
  const cust = tier2.customer;
  const comp = tier2.competitor;
  const co = tier2.company;
  return (
    <div className="space-y-6">
      {/* Customer */}
      <Section title="🧑‍🤝‍🧑 Customer" caption="市場・顧客">
        <p>{cust?.summary || '情報なし'}</p>
        {cust?.key_insights?.length ? (
          <ul className="mt-2 list-disc list-inside space-y-1 text-body-sm text-slate">
            {cust.key_insights.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
        ) : null}
      </Section>

      {/* Competitor */}
      <Section title="⚔️ Competitor" caption="競合環境">
        <p>{comp?.summary || '情報なし'}</p>
        {comp?.white_space && <p className="mt-2"><strong>空白地帯:</strong> {comp.white_space}</p>}
        {comp?.our_advantage && <p className="mt-1"><strong>自社優位性:</strong> {comp.our_advantage}</p>}
        {comp?.key_insights?.length ? (
          <ul className="mt-2 list-disc list-inside space-y-1 text-body-sm text-slate">
            {comp.key_insights.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
        ) : null}
      </Section>

      {/* Company */}
      <Section title="🏢 Company" caption="自社状況">
        <p>{co?.summary || '情報なし'}</p>
        {co?.reusable_assets?.length ? (
          <div className="mt-2">
            <strong>武器になる資産</strong>
            <ul className="list-disc list-inside text-body-sm text-slate">
              {co.reusable_assets.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        ) : null}
        {co?.key_persons?.length ? (
          <div className="mt-2">
            <strong>キーパーソン</strong>
            <ul className="list-disc list-inside text-body-sm text-slate">
              {co.key_persons.map((p, i) => (
                <li key={i}><strong>{p.name}</strong>: {p.role}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {co?.lessons_learned && <p className="mt-2"><strong>過去の学び:</strong> {co.lessons_learned}</p>}
      </Section>
    </div>
  );
}

function Section({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return (
    <article className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
      <div>
        <h3 className="text-heading-5 font-semibold">{title}</h3>
        <p className="text-caption text-slate">{caption}</p>
      </div>
      <div className="text-body-sm text-charcoal">{children}</div>
    </article>
  );
}
