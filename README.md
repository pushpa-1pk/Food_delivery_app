# Jay Malhar Food Marketplace

Production-oriented full-stack food ordering platform for a single restaurant brand, with customer ordering, seller operations, and admin controls.

## Architecture

- `client`: Next.js 14, TypeScript, TailwindCSS, Zustand, TanStack Query, React Hook Form, Zod
- `server`: Express.js, TypeScript, Prisma, PostgreSQL, Redis-ready caching, JWT auth, RBAC, Swagger
- `docker-compose.yml`: local PostgreSQL and Redis

## Why PostgreSQL

Your prompt mentioned MongoDB and also a managed PostgreSQL deployment target. For a single-brand food ordering system with relational order data, payments, reviews, and analytics, this scaffold uses PostgreSQL with Prisma for stronger transactional consistency.

## Roles

- `CUSTOMER`
- `SELLER`
- `ADMIN`

For your current business requirement, the seller flow is optimized for one restaurant owner account managing the Jay Malhar brand.

## Local setup

1. Start infrastructure:

```bash
docker compose up -d
```

2. Create environment files:

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env.local`

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and migrate:

```bash
npm --workspace server run prisma:generate
npm --workspace server run prisma:migrate
```

5. Seed the database:

```bash
npm --workspace server run prisma:seed
```

6. Start development servers:

```bash
npm run dev
```

## Main URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`
- Swagger docs: `http://localhost:5000/docs`

## Production readiness included

- JWT access and refresh token flow
- Bcrypt password hashing
- Email verification and password reset flow hooks
- RBAC middleware
- Helmet, CORS, rate limiting, input validation
- Centralized error handling
- Prisma schema with indexes and enums
- Docker-friendly structure
- Swagger API docs
- Unit/API test scaffolds
- CI-ready scripts

## Suggested deployment

- Frontend: Vercel
- Backend: Railway, Render, or AWS ECS/App Runner
- Database: Neon, Supabase Postgres, RDS, or Railway Postgres
- Redis: Upstash or managed Redis
- Media: Cloudinary
- Payments: Razorpay for India or Stripe where applicable

## Important integration notes

- Replace placeholder email transport config with real SMTP credentials
- Replace mock payment service with Razorpay/Stripe webhook verification in production
- Set secure cookie and JWT secrets before deployment
- Add CDN-backed image optimization and WAF/rate limiting at the edge
