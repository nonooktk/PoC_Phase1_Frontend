/**
 * app/login/page.tsx — 1-1 ログイン画面（Phase 1 はモック）
 * 仕様書 §9.2 1-1: Entra ID SSO（Phase 2 で本実装）
 * Phase 1 では固定ユーザーから選択するモック実装
 *
 * AuthGuard と連動: ?next=/history などのクエリがあればログイン後そこへ復帰
 */
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { setUserId } from '@/lib/session';

const MOCK_USERS = [
  {
    id: 1,
    name: 'デモユーザー',
    email: 'demo.user@tech0n.local',
    role: 'アナリスト',
    classification: '社外秘',
  },
  {
    id: 2,
    name: '管理者ユーザー',
    email: 'admin.user@tech0n.local',
    role: '管理者 (admin)',
    classification: '機密',
  },
  {
    id: 3,
    name: '黒崎 CDO',
    email: 'kurosaki.cdo@tech0n.local',
    role: '承認者 (admin)',
    classification: '機密',
  },
  {
    id: 4,
    name: 'ゲストビューワー',
    email: 'viewer.guest@tech0n.local',
    role: 'ビューワー',
    classification: '一般',
  },
];

function LoginInner() {
  const [selected, setSelected] = useState<number>(1);
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  const handleLogin = () => {
    setUserId(selected);
    // window.location ではなく router でも OK だが、AuthGuard の useEffect 確実発火のため
    // ナビゲーション完了後に再判定が走るフルロードを使う
    window.location.href = next;
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card-base shadow-card">
        <header className="text-center mb-6">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-brand-yellow text-primary font-bold mb-2">
            T0
          </span>
          <h1 className="text-heading-2">Tech0 Search</h1>
          <p className="text-body-sm text-slate mt-1">
            社員専用アクセス（Phase 1 PoC: モックログイン）
          </p>
        </header>

        <fieldset className="mb-4">
          <legend className="text-body-sm font-semibold mb-2">
            ユーザーを選択してください
          </legend>
          <div className="space-y-2">
            {MOCK_USERS.map((u) => (
              <label
                key={u.id}
                className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer ${
                  selected === u.id
                    ? 'border-brand-blue bg-surface-pricing-featured'
                    : 'border-hairline'
                }`}
              >
                <input
                  type="radio"
                  name="user"
                  value={u.id}
                  checked={selected === u.id}
                  onChange={() => setSelected(u.id)}
                  aria-label={u.name}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-caption text-slate">{u.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-caption text-brand-blue">{u.role}</p>
                    <span className="text-caption text-slate">
                      閲覧上限: {u.classification}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <button onClick={handleLogin} className="btn-primary w-full">
          このユーザーで入室
        </button>

        <p className="text-caption text-slate text-center mt-4">
          ※ Phase 2 で Microsoft Entra ID SSO に切替予定（仕様書 §17.1）
        </p>

        <p className="text-center mt-4">
          <Link href="/" className="text-body-sm">
            トップへ戻る
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  // useSearchParams は Suspense boundary が必要 (Next.js 14)
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
