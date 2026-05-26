/**
 * Header.tsx — グローバルナビゲーション
 * 仕様書 §9.1: ロゴ + 新規分析 + 分析履歴 + ユーザー + 機密バッジ
 * DESIGN.md: 黄色ロゴ + 横並びリンク + 右側 CTA
 *
 * ログイン状態を /api/v1/me で取得し、Header 全体を権限に合わせて切り替える:
 * - max_classification → バッジ色分け
 * - role === 'admin' → 「データ投入」リンク表示
 * - 未ログイン → 「ログイン」ボタン表示
 * - ログイン中 → 「ログアウト」ボタン表示
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchMe, type MeResponse } from '@/lib/api';
import { clearUserId, getUserId } from '@/lib/session';

const BASE_NAV = [
  { href: '/', label: '新規分析' },
  { href: '/history', label: '分析履歴' },
];

const ADMIN_NAV = [{ href: '/admin/data-input', label: 'データ投入' }];

/** 機密レベルに応じたバッジクラス (既存 badge-tag-* を流用) */
function classificationBadgeClass(level: string): string {
  switch (level) {
    case '機密':
      return 'badge-tag-coral';
    case '社外秘':
      return 'badge-tag-yellow';
    case '一般':
    default:
      return 'badge-tag-purple';
  }
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [meLoaded, setMeLoaded] = useState(false);

  // ログイン中なら /me を取得 (pathname 変化時に再取得しても良いが、ログアウト時のみで十分)
  useEffect(() => {
    const uid = getUserId();
    if (uid === null) {
      setMe(null);
      setMeLoaded(true);
      return;
    }
    fetchMe()
      .then((m) => setMe(m))
      .catch(() => setMe(null))
      .finally(() => setMeLoaded(true));
  }, [pathname]);

  const handleLogout = () => {
    clearUserId();
    setMe(null);
    router.replace('/login');
  };

  const navItems = me?.role_name === 'admin' ? [...BASE_NAV, ...ADMIN_NAV] : BASE_NAV;

  return (
    <header className="sticky top-0 z-20 bg-canvas border-b border-hairline">
      <div className="max-w-[1280px] mx-auto h-16 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* ロゴ: 黄色（DESIGN.md ブランド規定） */}
          <Link
            href="/"
            className="flex items-center gap-2 no-underline"
            aria-label="Tech0 Search ホーム"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-brand-yellow text-primary font-bold">
              T0
            </span>
            <span className="text-heading-5 text-ink">Tech0 Search</span>
          </Link>
          {me && (
            <nav className="hidden md:flex items-center gap-2" aria-label="メインナビゲーション">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm no-underline ${
                      active
                        ? 'text-ink font-semibold underline underline-offset-4'
                        : 'text-slate hover:text-ink'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          {meLoaded && me ? (
            <>
              {/* 部署 + 機密レベルバッジ (§9.1 / §9.2 1-2 常時表示) */}
              <span className="hidden md:inline text-caption text-slate">
                {me.name} / {me.department_name || '部署なし'}
              </span>
              <span
                className={classificationBadgeClass(me.max_classification)}
                aria-label={`閲覧可能な最大機密レベル: ${me.max_classification}`}
                title={`閲覧可能: ${me.allowed_levels.join(' / ')}`}
              >
                機密レベル: {me.max_classification}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary !py-2 !px-4 text-xs no-underline"
              >
                ログアウト
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-secondary !py-2 !px-4 text-xs no-underline">
              ログイン
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
