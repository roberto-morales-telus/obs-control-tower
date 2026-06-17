# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check with `tsc` then produce a Vite production build (TypeScript errors fail the build)
- `npm run preview` — serve the built `dist/` locally

There are no tests, linter, or formatter configured.

## Architecture

Single-page educational site about AWS observability (CloudWatch, Logs Insights, X-Ray). Vanilla TypeScript + Vite — no UI framework, no router, no state library.

**Rendering model:** `src/main.ts` is the single entry point. It writes a static header/nav shell into `#app`, then calls one `renderXxxSection(mainContent)` per section in `src/components/`. Each component module exports a single `render…Section(container: HTMLElement): void` function that creates a `<section>` element, sets `innerHTML` from a template literal, and appends it to `container`. There is no shared component base, no reactivity, and no re-rendering — sections are written once on load.

**Cross-cutting behaviors** are wired up in `main.ts` after all sections render:
- `setupSmoothScroll` — delegates clicks on any `a[href^="#"]` to `scrollIntoView`. New nav links automatically inherit this; no per-component wiring needed.
- `setupScrollAnimations` — `IntersectionObserver` toggles `.is-visible` on any element with `.reveal`. To opt a new element into the entrance animation, just add the `reveal` class in its template.

**Adding a new section:** create `src/components/<name>.ts` exporting `render<Name>Section`, import and call it from `main.ts` in the desired order, and add a matching `<a href="#<id>">` to the nav in `main.ts`. Use the section's `id` as both the anchor target and the `<section id>`.

**Styling:** all styles live in `src/style.css` (single global stylesheet). Components reference shared classes like `container`, `section`, `reveal`, `feature-badge`, `stat-card`, `button`, `button-primary`. Prefer reusing these over adding new class names.

## Repo notes

- `AGENTS.md`, `HOOKS.md`, `MCP.md`, `SKILLS.md` at the repo root are personal/tooling notes, not part of the app — ignore them when reasoning about the product.
