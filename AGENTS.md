# AGENTS.md - PuckFinance Frontend Development Guide

This file provides guidelines and instructions for AI agents working on this codebase.

## Project Overview

- **Project**: PuckFinance Frontend
- **Type**: Next.js 15 Web Application with TypeScript
- **Framework**: Next.js 15 (App Router), React 19, Tailwind CSS 4
- **Package Manager**: pnpm

## Build, Lint, and Test Commands

### Development
```bash
pnpm dev          # Start development server with Turbopack
```

### Build & Production
```bash
pnpm build        # Build the Next.js application
pnpm start        # Start production server
```

### Linting
```bash
pnpm lint         # Run ESLint (next lint)
```

### Installing Dependencies
```bash
pnpm install      # Install all dependencies
```

## Code Style Guidelines

### General Principles
- Use **pnpm** for package management (not npm or yarn)
- Follow Next.js 15 App Router conventions
- Write clear, readable code over performant code
- Fully implement all requested functionality with no placeholders
- Ensure code is complete and verified before finishing

### TypeScript Conventions
- Use explicit typing for function parameters and return types
- Use `type` for interfaces and type aliases
- Use `interface` for object shapes that may be extended
- Avoid `any` type when possible (ESLint rule is disabled, but avoid unnecessary usage)
- Use proper TypeScript types over JavaScript primitives when needed

### Naming Conventions
- **Components**: PascalCase (e.g., `TradeAccountCard`, `AppHeader`)
- **Functions**: camelCase (e.g., `getBalance`, `executeEntry`)
- **Variables**: camelCase (e.g., `accessToken`, `tradeAccountId`)
- **Constants**: UPPER_SNAKE_CASE for configuration constants
- **Files**: kebab-case for utilities, PascalCase for components
- **Interfaces/Types**: PascalCase with descriptive names (e.g., `TradeAccount`, `Balance`)

### Imports
- Use `@/` alias for absolute imports from project root
- Order imports: React/Next imports, then external libraries, then internal modules
- Group imports logically within each section
- Use named imports over default imports where possible

```typescript
// Example import order
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getTradeAccounts } from "@/lib/trade-accounts";
```

### Component Structure

#### Client Components
- Add `"use client"` directive at the top for client-side components
- Use functional components with hooks
- Destructure props with proper typing

```typescript
"use client";

interface MyComponentProps {
  title: string;
  onSubmit: (data: FormData) => Promise<void>;
}

export function MyComponent({ title, onSubmit }: MyComponentProps) {
  // component logic
}
```

#### Server Components (Default)
- Omit `"use client"` for server components
- Use async/await for data fetching
- Keep server components free of client-side state

### UI Components (Radix UI + Tailwind)
- Use Radix UI primitives for accessibility (via `@radix-ui/react-*` packages)
- Use Tailwind CSS for styling
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Use `cva` (class-variance-authority) for component variants

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### Error Handling

#### API Functions (lib/)
- Throw descriptive `Error` objects with user-friendly messages
- Check `response.ok` and parse error responses
- Always validate required parameters at the start of functions

```typescript
export async function getBalance(
  tradeAccountId: string,
  accessToken?: string
): Promise<Balance> {
  if (!accessToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch balance");
  }

  return response.json();
}
```

#### React Components
- Use try/catch with async operations in useEffect
- Store errors in state and display user-friendly messages
- Use loading states during async operations

```typescript
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(true);

try {
  const data = await fetchData();
  setError(null);
} catch (err: any) {
  setError(err.message || "Failed to load data");
} finally {
  setLoading(false);
}
```

### Formatting
- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Add trailing commas in multi-line objects and arrays
- Use Prettier defaults (enforced by Next.js)

### Tailwind CSS
- Use Tailwind CSS 4 syntax
- Use semantic color names (e.g., `bg-primary`, `text-destructive`)
- Use responsive prefixes (e.g., `md:`, `lg:`)
- Use `dark:` prefix for dark mode styles

### File Organization
```
app/                    # Next.js App Router pages
  api/                  # API routes
  (auth)/               # Authentication pages
  (dashboard)/          # Protected dashboard pages
components/
  ui/                   # Reusable UI components
  [feature]/            # Feature-specific components
lib/                    # Utility functions and API clients
types/                  # Global type definitions (if needed)
```

### Next.js Specific
- Use Server Components by default
- Use `next/image` for images
- Use `next/link` for navigation
- Use `next/navigation` hooks (useRouter, usePathname)
- Use environment variables with `NEXT_PUBLIC_` prefix for client-side
- Place API routes in `app/api/` directory

### Testing
- No test framework is currently configured
- Test manually by running `pnpm dev` and checking functionality

### Cursor Rules (Applied)
This project has Cursor rules in `.cursor/rules/general-typeescript-nextjs-rule.mdc`:
- Follow user's requirements carefully
- Think step-by-step and describe plans in pseudocode first
- Write correct, bug-free, secure, performant code
- Focus on readability over performance
- Fully implement all functionality with no placeholders
- Use pnpm for package management

## Common Tasks

### Creating a New Page
1. Create file in `app/` directory following routing conventions
2. Add `export default function PageName()` component
3. Use appropriate layout (server or client component)
4. Add AuthGuard for protected routes

### Creating a New API Route
1. Create file in `app/api/[resource]/route.ts`
2. Export handlers: `GET`, `POST`, `PUT`, `DELETE`
3. Return proper Response with error handling

### Adding a New UI Component
1. Create in `components/ui/` directory
2. Use Radix UI primitive if applicable
3. Define variants with cva
4. Export component and variants

### Adding a New API Client Function
1. Create or extend function in `lib/` directory
2. Add proper TypeScript types
3. Handle authentication and errors
4. Throw descriptive errors
