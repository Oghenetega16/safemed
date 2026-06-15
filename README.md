# Panacea — Healthcare Dashboard

A responsive, accessible healthcare operations dashboard built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, and Zustand.

## Stack

- **Next.js 15** (App Router, Server Components where possible)
- **TypeScript**
- **Tailwind CSS** with a custom design-token theme (colors, radii, shadows)
- **Framer Motion** for entrance animations, layout transitions, and the AI Insights pulse
- **Recharts** for the patient risk donut and patient statistics bar chart
- **Zustand** for lightweight UI state (sidebar collapse/drawer, calendar selection, active nav)
- **TanStack Query** wired up via a provider, ready for live data fetching
- **lucide-react** for all icons (SVG, tree-shakeable)
- **Manrope** font via `next/font/google`

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
src/
  app/
    layout.tsx       # Root layout, Manrope font, QueryProvider
    page.tsx          # Dashboard page composition
    globals.css       # Tailwind base + a11y focus styles
  components/
    layout/           # Sidebar, Topbar, PageHeading
    dashboard/        # StatCards, PatientRiskAnalytics, PatientStatistics,
                       # AppointmentOverview, AppointmentCalendar
    providers/        # QueryProvider (TanStack Query)
  data/               # Mock dashboard data (swap for API calls)
  store/              # Zustand UI store
  types/              # Shared TS types
  lib/                # cn() class helper
```

## Accessibility & responsiveness

- Visible focus rings (`:focus-visible`) throughout
- Semantic landmarks (`nav`, `main`, `header`, `aside`) with `aria-label`s
- Mobile drawer sidebar with overlay + `role="dialog"`, `aria-modal`
- Calendar days are buttons with `aria-current` / `aria-label`
- `prefers-reduced-motion` respected globally
- Fully responsive grid: stacks to single column on mobile, up to 5-column stat row on large screens

## Notes

- Data in `src/data/dashboard.ts` is mocked to match the reference design; replace with real API calls (TanStack Query hooks) as needed.
- Sidebar supports collapse (desktop) and an off-canvas drawer (mobile), both driven by Zustand.
