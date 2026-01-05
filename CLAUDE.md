# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wipe Right is a toilet paper value calculator built with React 19, TypeScript, Vite, and Tailwind CSS v4. It helps users compare toilet paper packages to find the best value by calculating price per 100 sheets and price per square foot.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Type-check and build for production
pnpm lint         # Run ESLint
pnpm preview      # Preview production build

# Testing
pnpm vitest       # Run tests in watch mode
pnpm vitest run   # Run tests once
```

## Architecture

### Data Flow
- `App.tsx` manages product state via `useLocalStorage` hook (persists to `wipe-right-products` key)
- Products are compared side-by-side in `ProductCard` components
- Winner detection happens in real-time via `findWinner()` (requires 2+ valid products)

### Key Files
- `src/types.ts` - `Product` and `CalculatedMetrics` interfaces
- `src/lib/calculations.ts` - Core calculation logic:
  - `calculateMetrics()` - Computes price per 100 sheets and price per sq ft
  - `findWinner()` - Returns ID of product with lowest price per 100 sheets
  - `createEmptyProduct()` - Factory for new products with UUID
- `src/hooks/useLocalStorage.ts` - Generic hook for persisting state

### UI Components
- Uses shadcn/ui (new-york style) with Tailwind v4
- Components in `src/components/ui/` are from shadcn
- Path aliases configured: `@/` maps to `src/`
- Icons from lucide-react

### Calculations
- Price per 100 sheets: `(price / (rolls * sheetsPerRoll)) * 100`
- Price per square foot: `price / (totalSheets * (width/12 * height/12))`
- Sheet dimensions are in inches; converted to feet for sq ft calculation

## Constraints from Project Requirements

- Use existing shadcn components without custom styling
- Only implement what's requested - avoid over-engineering
- Ensure calculations are 100% accurate
