# Migration Report: Vite to Next.js (App Router)

This document summarizes the migration of the portfolio website from Vite + React + TypeScript to Next.js (App Router).

## Summary of Work Done

1.  **Project Setup**:
    *   Created `next.config.ts` and `next-env.d.ts`.
    *   Updated `package.json` with Next.js scripts (`dev`, `build`, `start`) and removed Vite scripts.
    *   Uninstalled Vite-specific dependencies: `@tanstack/react-router`, `@tailwindcss/vite`, `@vitejs/plugin-react`, `vite`, `eslint-plugin-react-refresh`.
    *   Installed `next` (supporting React 19).

2.  **App Structure & Routing**:
    *   Created `src/app/layout.tsx` (Root Layout) incorporating Inter font, global CSS (`index.css`), and Vercel Analytics.
    *   Created `src/app/page.tsx` (Home Page) as a Client Component to support GSAP and state.
    *   Created `src/app/demo/page.tsx` (Demo Page) as a Client Component.
    *   Created `src/app/portfolio/page.tsx` to handle the specific behavior of opening the portfolio PDF and redirecting to the home page.

3.  **Component Conversions**:
    *   Added `"use client"` directive to components using browser APIs or state:
        *   `PortfolioHero.tsx`
        *   `Antigravity.tsx`
        *   `Preloader.tsx`
        *   `InfiniteMenu.tsx`
        *   `BubbleMenu.tsx`
    *   Fixed SSR error in `PortfolioHero.tsx` where `localStorage` was accessed during initial state evaluation. Moved it to `useEffect`.

4.  **Cleanup**:
    *   Removed Vite entry points and config files: `src/main.tsx`, `src/App.tsx`, `src/router.tsx`, `index.html`, `vite.config.ts`, `tsconfig.node.json`, `src/App.css`, `src/vite-env.d.ts`.
    *   Removed unused directories: `src/pages`, `src/layouts`.

5.  **Verification**:
    *   Verified that `npm run dev` starts successfully.
    *   Verified that `npm run build` succeeds without errors.
    *   Captured "after" screenshots and saved them alongside baseline screenshots in `baseline_screenshots/`.

## Screenshots

The following screenshots are available in the `baseline_screenshots/` directory for comparison:

*   `home.png` vs `migration_test_home.png`
*   `demo.png` vs `migration_test_demo.png`
*   `portfolio_pdf.png` vs `migration_test_portfolio_pdf.png`

## Next Steps

*   [ ] Review the "after" screenshots to ensure visual parity.
*   [ ] Test interactive elements (WebGL menu, animations) in a full browser environment.
*   [ ] Deploy the Next.js app to Vercel or your preferred hosting provider.
