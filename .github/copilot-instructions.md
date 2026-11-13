# DevFlow - GitHub Copilot Instructions

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript (Strict mode, no `any`)
- Styling: Tailwind CSS (Utility-first classes)
- Database & ORM: PostgreSQL with Prisma ORM
- Authentication: NextAuth.js or Clerk

## Project Architecture & Directory Structure
- `app/`: Next.js App Router pages and API route handlers.
- `app/api/tasks/`: REST endpoints for task CRUD operations.
- `app/dashboard/`: Main sprint and task dashboard view.
- `components/kanban/`: Reusable UI components like `TaskCard.tsx` and `TaskModal.tsx`.
- `prisma/`: Database schema and migrations.

## Coding Standards
- Always use strict TypeScript types and interfaces. Do not use `any`.
- Use functional components and React hooks (`useState`, `useEffect`).
- Follow Tailwind CSS utility classes for all styling. Keep custom CSS in `globals.css` minimal.
- Write clean error handling in all API route handlers (`try/catch` returning proper HTTP status codes).