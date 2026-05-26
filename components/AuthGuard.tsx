/**
 * AuthGuard.tsx — 未認証アクセスを /login へリダイレクトするクライアントガード
 *
 * 仕様書 §17.1 (Deny by Default) / Phase 1 はモック認証 (sessionStorage)。
 * Phase 2 で middleware.ts + Cookie ベースに差し替える前提。
 *
 * /login パスはガード対象外 (無限ループ防止)。
 */
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { isLoggedIn } from '@/lib/session';

const PUBLIC_PATHS = ['/login'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (isPublic) {
      setChecked(true);
      return;
    }
    if (!isLoggedIn()) {
      const next = pathname && pathname !== '/' ? `?next=${encodeURIComponent(pathname)}` : '';
      router.replace(`/login${next}`);
      return;
    }
    setChecked(true);
  }, [pathname, isPublic, router]);

  // 判定中は空 (ハイドレーション不一致を避けるため何も描画しない)
  if (!checked && !isPublic) {
    return null;
  }
  return <>{children}</>;
}
