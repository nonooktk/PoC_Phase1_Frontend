/**
 * layout.tsx — ルートレイアウト
 * 仕様書 §2.4 / §9.1: Header + メイン + Footer の3層構造
 */
import type { Metadata } from 'next';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tech0 Search — PROJECT ZERO',
  description: '社内検索 + 投資判断AI（Phase 1 PoC）',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-canvas">
        <Header />
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 lg:px-8 py-8">
          <AuthGuard>{children}</AuthGuard>
        </main>
        <footer className="bg-footer-bg text-on-dark-muted text-sm py-6 px-4 lg:px-8">
          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row justify-between gap-2">
            <span>© Tech0 Search — PROJECT ZERO</span>
            <span>Phase 1 PoC · 社内利用専用</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
