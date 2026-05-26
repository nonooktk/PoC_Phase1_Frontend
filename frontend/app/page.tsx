/**
 * app/page.tsx — トップページ（1-2 入力 / 1-3 ローディング / 1-4 結果 / 1-5 Empty）
 * 仕様書 §9.2 1-2〜1-5 を useState 切替で 1 ページに集約
 */
'use client';

import { useState } from 'react';
import IdeaForm, { type IdeaFormValue } from '@/components/IdeaForm';
import LoadingPanel from '@/components/LoadingPanel';
import ResultDashboard from '@/components/ResultDashboard';
import EmptyState from '@/components/EmptyState';
import { createAnalysis, type AnalysisResponse } from '@/lib/api';
import { rotateIdempotencyKey } from '@/lib/idempotency';

type PageState = 'form' | 'loading' | 'result' | 'empty';

export default function HomePage() {
  const [state, setState] = useState<PageState>('form');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const submitAnalysis = async (v: IdeaFormValue) => {
    setError(null);
    setState('loading');
    try {
      const key = rotateIdempotencyKey();
      // user_id はバックエンドが X-User-Id ヘッダーから導出するため body には含めない
      const res = await createAnalysis(
        {
          market: v.market,
          asset: v.asset,
          idea_detail: v.ideaDetail,
        },
        key
      );
      // 結果が空っぽなら EmptyState
      const hasResults = res.stage1 || res.stage2;
      if (!hasResults) {
        setState('empty');
      } else {
        setResult(res);
        setState('result');
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      setState('form');
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setState('form');
  };

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-heading-1">投資判断 AI ダッシュボード</h1>
        <p className="text-subtitle text-slate mt-1">
          3 項目を入力すると、社内資料・特許・過去事例を横断し GO/NO 判定と提案 3 案を生成します。
        </p>
      </header>

      {error && (
        <div role="alert" aria-live="assertive" className="card-base bg-brand-red border-brand-red-dark text-coral-dark mt-4">
          <p className="font-semibold">⚠ 分析でエラーが発生しました</p>
          <p className="text-body-sm mt-1">{error}</p>
        </div>
      )}

      {state === 'form' && <IdeaForm onSubmit={submitAnalysis} />}
      {state === 'loading' && <LoadingPanel />}
      {state === 'result' && result && <ResultDashboard result={result} onReset={reset} />}
      {state === 'empty' && <EmptyState onRetry={reset} />}
    </div>
  );
}
