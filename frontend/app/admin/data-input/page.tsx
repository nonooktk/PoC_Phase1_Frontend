/**
 * app/admin/data-input/page.tsx — 過去案件 (past_projects) の手動投入フォーム
 *
 * 仕様書 §6.5 / §12.3 (UI からの投入要件) 準拠。
 * admin ロールのみ表示・送信可。投入と同時に Azure AI Search にも反映される。
 *
 * Phase 1 では本部長承認フローは未実装 (feature_flags.require_director_approval=0)。
 * Phase 2 で require_director_approval=1 のとき、機密レベル='機密' は pending_approval で保留。
 */
'use client';

import { useEffect, useState } from 'react';

import {
  createPastProject,
  fetchMe,
  type MeResponse,
  type PastProjectCreate,
} from '@/lib/api';

const OUTCOME_OPTIONS = [
  { value: 'success', label: '成功 (success)' },
  { value: 'fail', label: '失敗 (fail)' },
  { value: 'partial', label: '部分達成 (partial)' },
] as const;

const DEPARTMENTS = [
  { id: 1, name: 'エネルギーソリューション事業部' },
  { id: 2, name: 'バイオ事業本部' },
  { id: 3, name: '事業開発本部' },
  { id: 4, name: '医療機器事業部' },
  { id: 5, name: '品質保証・薬事本部' },
  { id: 7, name: 'R&D 統括本部' },
];

const ALL_CLASSIFICATIONS = ['一般', '社外秘', '機密'] as const;

type FieldErrors = Partial<Record<keyof PastProjectCreate, string>>;

export default function DataInputPage() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [meLoaded, setMeLoaded] = useState(false);

  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [outcome, setOutcome] = useState<PastProjectCreate['outcome']>('success');
  const [conditionsNowText, setConditionsNowText] = useState('');
  const [reusableAssetsText, setReusableAssetsText] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [classification, setClassification] = useState<PastProjectCreate['classification_level']>('社外秘');
  const [sourceDocId, setSourceDocId] = useState('');
  const [businessUnitId, setBusinessUnitId] = useState<number>(7);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setMe)
      .catch(() => setMe(null))
      .finally(() => setMeLoaded(true));
  }, []);

  if (!meLoaded) {
    return <p className="text-body-sm text-slate">読み込み中...</p>;
  }
  if (!me || me.role_name !== 'admin') {
    return (
      <div className="card-base shadow-card">
        <h1 className="text-heading-2 mb-2">アクセス権限がありません</h1>
        <p className="text-body-sm text-slate">
          データ投入は admin ロールのみ可能です (現在のロール: {me?.role_name || '未ログイン'})。
        </p>
      </div>
    );
  }

  const resetForm = () => {
    setProjectId('');
    setTitle('');
    setOutcome('success');
    setConditionsNowText('');
    setReusableAssetsText('');
    setLessonsLearned('');
    setClassification('社外秘');
    setSourceDocId('');
    setBusinessUnitId(7);
    setFieldErrors({});
  };

  const validate = (): FieldErrors => {
    const errs: FieldErrors = {};
    if (!projectId.trim()) errs.project_id = 'project_id は必須です';
    else if (!/^[A-Za-z0-9_\-]+$/.test(projectId)) errs.project_id = '英数字 / _ / - のみ使用可能';
    if (!title.trim()) errs.title = 'タイトルは必須です';
    if (conditionsNowText.trim()) {
      try {
        JSON.parse(conditionsNowText);
      } catch {
        errs.conditions_now = '有効な JSON ではありません';
      }
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const body: PastProjectCreate = {
      project_id: projectId.trim(),
      title: title.trim(),
      outcome,
      classification_level: classification,
      business_unit_id: businessUnitId,
    };
    if (conditionsNowText.trim()) body.conditions_now = JSON.parse(conditionsNowText);
    if (reusableAssetsText.trim()) {
      body.reusable_assets = reusableAssetsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (lessonsLearned.trim()) body.lessons_learned = lessonsLearned.trim();
    if (sourceDocId.trim()) body.source_doc_id = sourceDocId.trim();

    setSubmitting(true);
    try {
      const res = await createPastProject(body);
      setSubmitSuccess(`投入成功: ${res.project_id} (status=${res.status})`);
      resetForm();
    } catch (err: unknown) {
      setSubmitError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  // ユーザー権限以下のみ機密レベルを選択肢に
  const visibleClassifications = ALL_CLASSIFICATIONS.filter((c) => me.allowed_levels.includes(c));

  return (
    <div className="max-w-3xl mx-auto">
      <header className="mb-6">
        <h1 className="text-heading-1">過去案件の投入</h1>
        <p className="text-subtitle text-slate mt-1">
          past_projects テーブルに 1 件追加します。投入と同時に Azure AI Search にも反映されます。
        </p>
      </header>

      {submitError && (
        <div role="alert" className="card-base bg-brand-red border-brand-red-dark text-coral-dark mb-4">
          <p className="font-semibold">⚠ 投入に失敗しました</p>
          <p className="text-body-sm mt-1 whitespace-pre-wrap">{submitError}</p>
        </div>
      )}
      {submitSuccess && (
        <div role="status" className="card-base bg-surface-pricing-featured border-brand-blue mb-4">
          <p className="font-semibold">✓ {submitSuccess}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card-base shadow-card space-y-5">
        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="project_id">
            project_id <span className="text-coral-dark">*</span>
            <span className="text-caption text-slate ml-2">英数字 / _ / -, 例: proj_101</span>
          </label>
          <input
            id="project_id"
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full border border-hairline rounded-md px-3 py-2"
            aria-invalid={!!fieldErrors.project_id}
            aria-describedby={fieldErrors.project_id ? 'project_id_err' : undefined}
          />
          {fieldErrors.project_id && (
            <p id="project_id_err" className="text-caption text-coral-dark mt-1">
              {fieldErrors.project_id}
            </p>
          )}
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="title">
            タイトル <span className="text-coral-dark">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-hairline rounded-md px-3 py-2"
            aria-invalid={!!fieldErrors.title}
            aria-describedby={fieldErrors.title ? 'title_err' : undefined}
          />
          {fieldErrors.title && (
            <p id="title_err" className="text-caption text-coral-dark mt-1">
              {fieldErrors.title}
            </p>
          )}
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="outcome">
            結果 <span className="text-coral-dark">*</span>
          </label>
          <select
            id="outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as PastProjectCreate['outcome'])}
            className="w-full border border-hairline rounded-md px-3 py-2"
          >
            {OUTCOME_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="business_unit_id">
            起案事業部 <span className="text-coral-dark">*</span>
          </label>
          <select
            id="business_unit_id"
            value={businessUnitId}
            onChange={(e) => setBusinessUnitId(Number(e.target.value))}
            className="w-full border border-hairline rounded-md px-3 py-2"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id}. {d.name}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="classification">
            機密レベル <span className="text-coral-dark">*</span>
            <span className="text-caption text-slate ml-2">
              (あなたの上限: {me.max_classification})
            </span>
          </label>
          <select
            id="classification"
            value={classification}
            onChange={(e) =>
              setClassification(e.target.value as PastProjectCreate['classification_level'])
            }
            className="w-full border border-hairline rounded-md px-3 py-2"
          >
            {visibleClassifications.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="lessons_learned">
            得られた教訓 (任意)
          </label>
          <textarea
            id="lessons_learned"
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            rows={3}
            className="w-full border border-hairline rounded-md px-3 py-2"
          />
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="reusable_assets">
            再利用可能な資産 (任意, 1 行 1 項目)
          </label>
          <textarea
            id="reusable_assets"
            value={reusableAssetsText}
            onChange={(e) => setReusableAssetsText(e.target.value)}
            rows={3}
            className="w-full border border-hairline rounded-md px-3 py-2"
            placeholder={`特許 JP-2020-12345\n海外パートナー: ABC corp.`}
          />
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="conditions_now">
            conditions_now (任意, JSON)
          </label>
          <textarea
            id="conditions_now"
            value={conditionsNowText}
            onChange={(e) => setConditionsNowText(e.target.value)}
            rows={4}
            className="w-full border border-hairline rounded-md px-3 py-2 font-mono text-caption"
            placeholder={`{"technology": "ready", "market": "growing"}`}
            aria-invalid={!!fieldErrors.conditions_now}
            aria-describedby={fieldErrors.conditions_now ? 'cn_err' : undefined}
          />
          {fieldErrors.conditions_now && (
            <p id="cn_err" className="text-caption text-coral-dark mt-1">
              {fieldErrors.conditions_now}
            </p>
          )}
        </fieldset>

        <fieldset>
          <label className="block text-body-sm font-semibold mb-1" htmlFor="source_doc_id">
            起源ドキュメント ID (任意)
          </label>
          <input
            id="source_doc_id"
            type="text"
            value={sourceDocId}
            onChange={(e) => setSourceDocId(e.target.value)}
            className="w-full border border-hairline rounded-md px-3 py-2"
            placeholder="RINGI-2018-0342"
          />
        </fieldset>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? '投入中...' : '投入する'}
          </button>
          <button type="button" onClick={resetForm} className="btn-secondary text-sm">
            リセット
          </button>
        </div>

        <p className="text-caption text-slate border-t border-hairline pt-3 mt-4">
          ※ Phase 1 では投入後に即時公開されます。Phase 2 で機密レベル『機密』は
          本部長承認フロー (feature_flags.require_director_approval) を経由するようになります。
        </p>
      </form>
    </div>
  );
}
