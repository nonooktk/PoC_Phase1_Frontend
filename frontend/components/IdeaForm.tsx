/**
 * IdeaForm.tsx — 1-2 アイデア入力フォーム
 * 仕様書 §9.2 1-2: 3 項目（市場/アセット/詳細）+ PDF + 黒ピル CTA
 * §9.4: aria-label / aria-required / WCAG 2.1 A
 */
'use client';

import { useState } from 'react';

export interface IdeaFormValue {
  market: string;
  asset: string;
  ideaDetail: string;
  pdf?: File;
}

export default function IdeaForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (v: IdeaFormValue) => void;
  disabled?: boolean;
}) {
  const [market, setMarket] = useState('');
  const [asset, setAsset] = useState('');
  const [ideaDetail, setIdeaDetail] = useState('');
  const [pdf, setPdf] = useState<File | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!ideaDetail.trim()) {
      setError('「提供価値・事業アイデアの詳細」は必ず入力してください。');
      return;
    }
    onSubmit({ market: market.trim(), asset: asset.trim(), ideaDetail: ideaDetail.trim(), pdf });
  };

  return (
    <section className="card-base shadow-card mt-6" aria-label="ビジネスアイデア入力フォーム">
      <h2 className="text-heading-3 mb-2">💡 ビジネスアイデアの入力</h2>
      <p className="text-body-sm text-slate mb-4">
        3 項目を入力すると AI が GO/NO 判定・3 軸評価・3C 分析・関連グラフを生成します（最大 30 秒）。
      </p>

      <form onSubmit={handleSubmit} aria-label="アイデア分析フォーム" className="space-y-4">
        {/* PDF アップロード */}
        <div>
          <label htmlFor="pdf" className="block text-body-sm font-semibold mb-1">
            📁 既存の企画書・関連資料をアップロード（任意）
          </label>
          <input
            id="pdf"
            type="file"
            accept="application/pdf"
            aria-label="企画書 PDF（任意）"
            disabled={disabled}
            className="text-input file:mr-3 file:rounded-md file:border-0 file:bg-surface file:px-3 file:py-1"
            onChange={(e) => setPdf(e.target.files?.[0])}
          />
          {pdf && (
            <p className="text-caption text-success-accent mt-1">
              📄 {pdf.name} を読み込みました
            </p>
          )}
        </div>

        {/* 2 カラム入力（市場 + アセット） */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label htmlFor="market" className="block text-body-sm font-semibold mb-1">
              ターゲット市場 / 想定顧客
            </label>
            <input
              id="market"
              type="text"
              className="text-input"
              placeholder="例：欧州の大規模農業法人"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              aria-label="①ターゲット市場・顧客"
              disabled={disabled}
            />
          </div>
          <div>
            <label htmlFor="asset" className="block text-body-sm font-semibold mb-1">
              活用したい自社アセット・コア技術
            </label>
            <input
              id="asset"
              type="text"
              className="text-input"
              placeholder='例：100%植物由来ポリマー「Green Planet」'
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              aria-label="②活用アセット・コア技術"
              disabled={disabled}
            />
          </div>
        </div>

        {/* アイデア詳細 */}
        <div>
          <label htmlFor="idea" className="block text-body-sm font-semibold mb-1">
            提供価値・事業アイデアの詳細
          </label>
          <textarea
            id="idea"
            className="textarea-input"
            placeholder="例：環境規制強化を背景に、農業用マルチフィルムとして展開。haあたり300ユーロの廃棄コストを削減し..."
            value={ideaDetail}
            onChange={(e) => setIdeaDetail(e.target.value)}
            aria-label="③提供価値・事業アイデア詳細"
            aria-required="true"
            disabled={disabled}
          />
        </div>

        {/* エラー表示（WCAG 2.1 A: 色のみでなくアイコン + テキスト） */}
        {error && (
          <div role="alert" aria-live="assertive" className="bg-brand-red border border-brand-red-dark rounded-md p-3">
            <span className="text-coral-dark font-semibold">⚠ {error}</span>
          </div>
        )}

        {/* CTA: 黒ピル */}
        <div className="pt-2">
          <button
            type="submit"
            className="btn-primary"
            disabled={disabled}
            aria-label="分析を開始する（処理に最大30秒かかります）"
          >
            投資判断 AI による分析スタート
          </button>
        </div>
      </form>
    </section>
  );
}
