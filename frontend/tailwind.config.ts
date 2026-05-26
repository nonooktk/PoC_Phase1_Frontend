/**
 * tailwind.config.ts — DESIGN.md (Miro 風) のトークンを Tailwind に移植
 *
 * 仕様書 §2.1 のブレークポイント (sm/md/lg/xl) + DESIGN.md のカラー・タイポ・
 * 角丸・スペーシングをそのまま反映。
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    // 仕様書 §2.1: PC ファースト、sm(640)/md(768)/lg(1024)/xl(1280)
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      // ========== カラー（DESIGN.md `colors:`）==========
      colors: {
        // Primary / on-primary
        primary: '#1c1c1e',
        'on-primary': '#ffffff',
        // ブランドイエロー（ロゴ・promo・yellow tag のみ）
        'brand-yellow': '#ffd02f',
        'brand-yellow-deep': '#fcb900',
        'yellow-light': '#fff4c4',
        'yellow-dark': '#746019',
        // ブランドブルー
        'brand-blue': '#4262ff',
        'blue-450': '#5b76fe',
        'blue-pressed': '#2a41b6',
        // パステル feature カード
        'brand-coral': '#ff9999',
        'coral-light': '#ffc6c6',
        'coral-dark': '#600000',
        'brand-rose': '#ffd8f4',
        'rose-light': '#fde0f0',
        'brand-pink': '#fde0f0',
        'brand-teal': '#0fbcb0',
        'teal-light': '#c3faf5',
        'moss-dark': '#187574',
        'brand-orange-light': '#ffe6cd',
        'brand-red': '#fbd4d4',
        'brand-red-dark': '#e3c5c5',
        // Surfaces
        canvas: '#ffffff',
        surface: '#f7f8fa',
        'surface-soft': '#fafbfc',
        'surface-yellow': '#fff8e0',
        'surface-pricing-featured': '#f5f3ff',
        // Hairlines
        hairline: '#e0e2e8',
        'hairline-soft': '#eef0f3',
        'hairline-strong': '#c7cad5',
        // Text
        'ink-deep': '#050038',
        ink: '#1c1c1e',
        charcoal: '#2c2c34',
        slate: '#555a6a',
        steel: '#6b6f7e',
        stone: '#8e91a0',
        muted: '#a5a8b5',
        'on-dark': '#ffffff',
        'on-dark-muted': '#a5a8b5',
        'footer-bg': '#1c1c1e',
        // Semantic
        'success-accent': '#00b473',
      },
      // ========== タイポグラフィ（Roobert PRO → Inter で代替）==========
      fontFamily: {
        // Roobert PRO がライセンス都合で使えないため Inter を採用（docs/DESIGN_NOTES.md 参照）
        sans: [
          'Inter',
          'Roobert PRO',
          'Noto Sans JP',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
      fontSize: {
        // DESIGN.md typography hierarchy
        'hero-display': ['80px', { lineHeight: '1.05', letterSpacing: '-2px', fontWeight: '500' }],
        'display-lg': ['60px', { lineHeight: '1.10', letterSpacing: '-1.5px', fontWeight: '500' }],
        'heading-1': ['48px', { lineHeight: '1.15', letterSpacing: '-1px', fontWeight: '500' }],
        'heading-2': ['36px', { lineHeight: '1.20', letterSpacing: '-0.5px', fontWeight: '500' }],
        'heading-3': ['28px', { lineHeight: '1.25', fontWeight: '500' }],
        'heading-4': ['22px', { lineHeight: '1.30', fontWeight: '500' }],
        'heading-5': ['18px', { lineHeight: '1.40', fontWeight: '500' }],
        subtitle: ['18px', { lineHeight: '1.50', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.50', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.50', fontWeight: '400' }],
        caption: ['13px', { lineHeight: '1.40', fontWeight: '400' }],
        micro: ['12px', { lineHeight: '1.40', fontWeight: '500' }],
        'stat-display': ['64px', { lineHeight: '1.10', letterSpacing: '-1.5px', fontWeight: '500' }],
      },
      // ========== 角丸（DESIGN.md `rounded:`）==========
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
        feature: '32px',
        full: '9999px',
      },
      // ========== スペーシング（DESIGN.md `spacing:`）==========
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        'sm-2': '12px',
        'md-2': '16px',
        'lg-2': '20px',
        'xl-2': '24px',
        'xxl': '32px',
        'xxxl': '40px',
        'section-sm': '48px',
        'section': '64px',
        'section-lg': '96px',
        'hero': '120px',
      },
      // ========== シャドウ（DESIGN.md elevation）==========
      boxShadow: {
        subtle: 'rgba(5, 0, 56, 0.04) 0px 1px 2px 0px',
        card: 'rgba(5, 0, 56, 0.06) 0px 4px 12px 0px',
        mockup: 'rgba(5, 0, 56, 0.08) 0px 12px 32px -4px',
        modal: 'rgba(5, 0, 56, 0.12) 0px 16px 48px -8px',
      },
    },
  },
  plugins: [],
};

export default config;
