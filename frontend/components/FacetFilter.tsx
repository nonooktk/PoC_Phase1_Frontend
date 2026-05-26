/**
 * FacetFilter.tsx — ファセット 2 軸（事業部 + 機密レベル）
 * 仕様書 §9.1 / OE-15: Phase 1 は 2 軸のみ
 *
 * 機密レベルラジオはユーザーの max_classification 以下のものだけ表示。
 */
'use client';

import { useState } from 'react';

const DEPARTMENTS = [
  { id: 1, name: 'エネルギー' },
  { id: 2, name: 'バイオ' },
  { id: 3, name: '事業開発' },
  { id: 4, name: '医療機器' },
  { id: 7, name: 'R&D' },
];

const ALL_CLASSIFICATIONS = ['一般', '社外秘', '機密'] as const;

export default function FacetFilter({
  onApply,
  allowedLevels,
}: {
  onApply: (deptIds: number[], classification?: string) => void;
  /** ユーザーが選択可能な機密レベル (権限以下)。省略時は全て選択可 */
  allowedLevels?: string[];
}) {
  const [selectedDepts, setSelectedDepts] = useState<number[]>([]);
  const [classification, setClassification] = useState<string>('');

  const toggleDept = (id: number) => {
    setSelectedDepts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ユーザー権限以下のみ表示
  const visibleClassifications = ALL_CLASSIFICATIONS.filter(
    (c) => !allowedLevels || allowedLevels.includes(c)
  );

  return (
    <aside className="card-base shadow-subtle p-4" aria-label="ファセット絞込">
      <h3 className="text-body-md font-semibold mb-3">🔎 絞り込み</h3>

      <fieldset className="mb-4">
        <legend className="text-body-sm font-semibold mb-2">事業部（複数選択可）</legend>
        <div className="space-y-1">
          {DEPARTMENTS.map((d) => (
            <label key={d.id} className="flex items-center gap-2 text-body-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDepts.includes(d.id)}
                onChange={() => toggleDept(d.id)}
                aria-label={`事業部: ${d.name}`}
              />
              {d.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-4">
        <legend className="text-body-sm font-semibold mb-2">
          機密レベル
          {allowedLevels && (
            <span className="text-caption text-slate ml-2">
              (閲覧上限: {allowedLevels[allowedLevels.length - 1]})
            </span>
          )}
        </legend>
        <div className="space-y-1">
          {['', ...visibleClassifications].map((c) => (
            <label key={c || 'all'} className="flex items-center gap-2 text-body-sm cursor-pointer">
              <input
                type="radio"
                name="classification"
                value={c}
                checked={classification === c}
                onChange={() => setClassification(c)}
                aria-label={c || '指定なし'}
              />
              {c || '指定なし'}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={() => onApply(selectedDepts, classification || undefined)}
        className="btn-primary w-full text-sm"
      >
        フィルタを適用
      </button>
    </aside>
  );
}
