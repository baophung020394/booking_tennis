# Tennis Booking & Coaching System - Frontend

A modern, scalable Next.js application for tennis court booking and coaching progress management.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui** - UI component library
- **react-hook-form** - Form management
- **zod** - Schema validation
- **framer-motion** - Animations
- **recharts** - Data visualization

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   ├── courts/
│   ├── coaches/
│   └── reports/
├── features/               # Feature-based modules
│   ├── auth/
│   ├── courts/
│   ├── booking/
│   ├── coaches/
│   ├── reports/
│   └── dashboard/
├── components/             # Shared UI components
│   ├── ui/                 # shadcn/ui components
│   └── layout/             # Layout components
├── lib/                    # Utilities and helpers
│   ├── utils.ts
│   └── mock-data.ts
└── types/                  # TypeScript type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Implemented (Phase 1)

- ✅ Authentication UI (Login & Register forms)
- ✅ Court listing with booking modal
- ✅ Coach listing
- ✅ Progress report form (coach)
- ✅ Student dashboard with skill trends
- ✅ Coach dashboard

## Architecture Principles

1. **Feature-based structure** - Each feature is self-contained with its own components, hooks, and types
2. **Server Components by default** - Using Next.js App Router with Server Components
3. **Form validation** - All forms use react-hook-form + zod
4. **Reusable components** - UI components are shared and reusable
5. **Type safety** - Full TypeScript coverage

## Next Steps

- Implement authentication logic
- Connect to backend API
- Add real-time booking updates
- Implement payment integration
- Add admin dashboard
