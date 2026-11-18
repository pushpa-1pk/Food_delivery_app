# 🍽️ Jay Malhar Food Marketplace

> A production-ready, full-stack food ordering and restaurant management platform engineered for single-brand restaurants and scalable food marketplace operations.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey?style=flat&logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red?style=flat&logo=redis)](https://redis.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-white?style=flat&logo=socket.io)](https://socket.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Customer Portal](#customer-portal)
  - [Restaurant Owner / Seller Portal](#restaurant-owner--seller-portal)
  - [Administrator Dashboard](#administrator-dashboard)
  - [Real-Time WebSocket Engine](#real-time-websocket-engine)
- [Architecture & System Design](#-architecture--system-design)
  - [High-Level Architecture](#high-level-architecture)
  - [Database Schema (ERD Overview)](#database-schema-erd-overview)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started / Local Setup](#-getting-started--local-setup)
  - [1. Clone and Install Dependencies](#1-clone-and-install-dependencies)
  - [2. Start Infrastructure (Docker)](#2-start-infrastructure-docker)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Database Migration and Seeding](#4-database-migration-and-seeding)
  - [5. Run Development Servers](#5-run-development-servers)
- [Default Demo Credentials](#-default-demo-credentials)
- [API Documentation & Endpoints](#-api-documentation--endpoints)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Production Deployment Recommendations](#-production-deployment-recommendations)
- [Contributing & License](#-contributing--license)

---

## 📖 Overview

**Jay Malhar Food Marketplace** is an end-to-end food ordering solution tailored for the **Jay Malhar** restaurant brand. It bridges customers, restaurant operations, and business managers into a single unified platform. 

The application solves key operational pain points in food retail:
- **Direct-to-consumer ordering:** Avoids excessive aggregator commissions with a bespoke digital storefront.
- **Live order pipeline management:** Real-time visibility into incoming orders, kitchen preparation, and delivery dispatch.
- **Relational consistency & auditability:** Robust financial and order tracking backed by transactional PostgreSQL and Prisma ORM.
- **Multi-role access control (RBAC):** Distinct dashboards and route authorization for Customers, Sellers/Kitchen Managers, and Platform Admins.

---

## ✨ Key Features

### Customer Portal
- **Rich Menu Browsing:** Categorized navigation (Morning Specials, Veg Specials, Non-Veg Specials, Chinese Specials, Thalis).
- **Search & Filters:** Instant search, veg/non-veg toggle, category filtering, and sorting.
- **Dynamic Shopping Cart:** Client-side cart backed by persistent state (`Zustand`), preserving cart items across browser sessions.
- **Discount & Coupon Engine:** Promo code application (`WELCOME10`, `FESTIVE15`) with dynamic subtotal recalculation.
- **Streamlined Checkout:** Delivery address selection, order instructions/notes, and payment method selection (Cash on Delivery / Online Payment ready).
- **Live Order Tracking:** Real-time order progress timeline (`PENDING` ➔ `ACCEPTED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).
- **Ratings & Reviews:** Customer feedback submission and star rating system per restaurant and menu item.
- **User Profile & Order History:** Detailed receipts and past order archives.

### Restaurant Owner / Seller Portal
- **Dedicated Kitchen/Owner Dashboard:** Quick access via owner sign-in.
- **Live Order Management Board:** Instant acoustic and visual notification when new orders land; one-click order acceptance, status transitions, and cancellations.
- **Menu Catalog Management:** Create, edit, and toggle food availability (in-stock vs. sold-out), update pricing, adjust veg/non-veg flags, and upload images.
- **Store Configuration:** Toggle store status (`Open` / `Closed`), update delivery fees, delivery radius, and opening hours.

### Administrator Dashboard
- **Business Analytics:** Aggregated metrics for total revenue, active orders, customer counts, and sales velocity.
- **Customer Oversight:** Customer registry, order histories, and notification dispatch.
- **Restaurant Approval Flow:** System capability to audit, approve, or suspend restaurant branches.
- **Coupon & Campaign Management:** Create and deactivate promotional discount vouchers.

### Real-Time WebSocket Engine
- **Socket.IO Integration:** Bidirectional communication between client and server.
- **Instant Event Triggers:** Real-time order status updates pushed directly to the customer's tracking screen without polling.
- **In-App Notifications:** Real-time bell notification updates for order dispatches, status adjustments, and alerts.

---

## 🏗️ Architecture & System Design

The application is structured as an **npm workspaces monorepo** separating concerns into:
- `client`: Next.js 14 App Router, modern reactive frontend with client and server components.
- `server`: Express.js + TypeScript RESTful API server with Prisma ORM, Redis caching hooks, and Socket.IO.

### High-Level Architecture

```
                       ┌────────────────────────┐
                       │     Browser Client     │
                       │  (Next.js 14 + React)  │
                       └───────────┬────────────┘
                                   │
                    HTTP REST API  │  WebSocket (Socket.IO)
                                   ▼
                       ┌────────────────────────┐
                       │    Express API Host    │
                       │   (TypeScript / Node)  │
                       └─────┬────────────┬─────┘
                             │            │
            Prisma ORM Client│            │ Cache / PubSub
                             ▼            ▼
                   ┌────────────┐      ┌────────────┐
                   │ PostgreSQL │      │   Redis    │
                   │  Database  │      │ Cache Store│
                   └────────────┘      └────────────┘
```

### Database Schema (ERD Overview)

Managed declaratively with **Prisma ORM** against **PostgreSQL**:

- **`User`**: Account identity, hashed passwords, roles (`CUSTOMER`, `SELLER`, `ADMIN`), email verification status, and notification preferences.
- **`Restaurant`**: Business profile, location, slug, operational status (`PENDING`, `APPROVED`, `SUSPENDED`), delivery radius, delivery fee, and opening hours.
- **`MenuItem`**: Dish details, price, category, veg/non-veg status, discount, image URL, and real-time availability.
- **`Order`**: Sequential `orderNumber`, status enum (`PENDING` to `DELIVERED`), total price, payment method, payment status, delivery address snapshot, and timestamps.
- **`OrderItem`**: Line items snapshot with quantity and locked purchase price.
- **`Coupon`**: Promotional discount percentage, expiration date, active flag, and usage count.
- **`Review`**: Customer rating (1-5 stars) and comments linked to restaurants and menu items.
- **`Notification`**: Role-based or user-specific alert records with read/unread tracking.

---

## 💻 Tech Stack

### Frontend (`/client`)
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router architecture)
- **Library:** [React 18](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `tailwind-merge` & `clsx`
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Cart & UI state persistence)
- **Server State & Data Fetching:** [TanStack React Query v5](https://tanstack.com/query/latest) & [Axios](https://axios-http.com/)
- **Form Handling & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Real-Time Client:** [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- **Notifications & UI Feedback:** [React Hot Toast](https://react-hot-toast.com/)
- **Date Formatting:** [date-fns](https://date-fns.org/)

### Backend (`/server`)
- **Runtime:** [Node.js](https://nodejs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Web Framework:** [Express.js 4](https://expressjs.com/)
- **Database & ORM:** [PostgreSQL 16](https://www.postgresql.org/) via [Prisma ORM 5](https://www.prisma.io/)
- **In-Memory Cache:** [Redis](https://redis.io/) via [ioredis](https://github.com/redis/ioredis)
- **Real-Time Engine:** [Socket.IO 4](https://socket.io/)
- **Authentication & Security:** 
  - JWT (JSON Web Tokens) with dual Access + Refresh token rotation
  - [bcryptjs](https://github.com/dcodeIO/bcrypt.js) password hashing
  - [Helmet](https://helmetjs.github.io/) HTTP security headers
  - [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) DDoS/brute-force defense
  - [CORS](https://github.com/expressjs/cors) strict origin protection
  - [cookie-parser](https://github.com/expressjs/cookie-parser) for secure token delivery
- **Validation:** [Zod](https://zod.dev/) request payload validation schemas
- **File & Media Handling:** [Multer](https://github.com/expressjs/multer) & [Cloudinary SDK](https://cloudinary.com/)
- **Email Service:** [Nodemailer](https://nodemailer.com/) (SMTP transactional emails)
- **Documentation:** [Swagger UI](https://swagger.io/) (`swagger-jsdoc` & `swagger-ui-express`)
- **Logging:** [Morgan](https://github.com/expressjs/morgan) HTTP logger

### DevOps & Infrastructure
- **Containerization:** Docker & Docker Compose (PostgreSQL 16 Alpine, Redis 7 Alpine)
- **Development Runtime:** `tsx` watch mode for instant TypeScript server execution
- **Testing:** [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)

---

## 📁 Project Directory Structure

```text
food/
├── docker-compose.yml         # Container configuration for PostgreSQL & Redis
├── package.json               # Root monorepo configuration with npm workspaces
├── README.md                  # Comprehensive project documentation
│
├── client/                    # Next.js Frontend Application
│   ├── public/                # Static assets (images, icons)
│   ├── src/
│   │   ├── app/               # Next.js 14 App Router pages & layouts
│   │   │   ├── (auth)/        # signin, signup, forgot-password, owner-login
│   │   │   ├── admin/         # Admin portal & dashboard routes
│   │   │   ├── cart/          # Cart review & coupon entry
│   │   │   ├── checkout/      # Address & payment processing
│   │   │   ├── orders/        # Order history & live tracking (/orders/[id])
│   │   │   ├── food/[id]/     # Menu item detail view
│   │   │   ├── restaurants/   # Restaurant profile & menu views
│   │   │   └── layout.tsx     # Global root layout with providers
│   │   ├── components/        # Reusable UI components (Navbar, Footer, Modals)
│   │   ├── lib/               # Utilities, axios instances, socket client
│   │   ├── providers/         # QueryClient, Socket & Auth context wrappers
│   │   ├── services/          # Frontend API service callers
│   │   └── store/             # Zustand stores (useCartStore, useAuthStore)
│   ├── tailwind.config.ts     # Tailwind CSS theme styling configuration
│   └── tsconfig.json          # Frontend TypeScript settings
│
└── server/                    # Express.js REST API Backend
    ├── prisma/
    │   ├── schema.prisma      # Database models, relations, enums & indexes
    │   └── seed.ts            # Seed script with users, restaurant & menu items
    ├── src/
    │   ├── config/            # Environment variables, database, redis, socket init
    │   ├── controllers/       # HTTP request handlers (auth, orders, menu, admin)
    │   ├── docs/              # Swagger OpenAPI documentation specifications
    │   ├── middlewares/       # Auth guards, role checks (RBAC), error handler
    │   ├── routes/            # Express route routers
    │   ├── services/          # Business logic layer (orders, email, payments)
    │   ├── types/             # TypeScript type declarations & interfaces
    │   ├── utils/             # Helper utilities, responses, token generators
    │   └── server.ts          # Express & HTTP server bootstrapping
    └── tsconfig.json          # Backend TypeScript settings
```

---

## ⚙️ Prerequisites

Before running the application locally, ensure you have the following installed:

- **Node.js**: `v18.18.0` or higher (Node 20 LTS recommended)
- **npm**: `v9.0.0` or higher
- **Docker & Docker Compose**: For running local PostgreSQL and Redis instances effortlessly.
- *(Optional)* Alternatively, external cloud instances of PostgreSQL (e.g., Supabase, Neon) and Redis (e.g., Upstash).

---

## 🚀 Getting Started / Local Setup

Follow these step-by-step instructions to get a local development environment running:

### 1. Clone and Install Dependencies

```bash
# Navigate to the project root directory
cd food

# Install root, client, and server dependencies in one command
npm install
```

### 2. Start Infrastructure (Docker)

Spin up the local PostgreSQL database and Redis server:

```bash
docker compose up -d
```

> **Verification:** Run `docker ps` to verify that both `jay-malhar-postgres` (port `5432`) and `jay-malhar-redis` (port `6379`) are running healthy.

### 3. Configure Environment Variables

Create the required environment files for both backend and frontend:

#### A. Backend Environment Setup (`server/.env`)
Copy the example template:
```bash
cp server/.env.example server/.env
```
Ensure the settings match your local environment:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/jay_malhar?schema=public
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
PAYMENT_PROVIDER=mock
SUPPORT_PHONE=+91 85518 15738
SUPPORT_EMAIL=support@jaymalhar.com
RESTAURANT_ADDRESS=Goregaon–Tiroda Main Road, Kunhadi, Maharashtra
COUPON_CODES=WELCOME10:10,FESTIVE15:15
```

#### B. Frontend Environment Setup (`client/.env.local`)
Copy the example template:
```bash
cp client/.env.example client/.env.local
```
Configure client variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME="Jay Malhar"
```

### 4. Database Migration and Seeding

Run the Prisma migrations to create the database schema and seed initial data:

```bash
# Generate Prisma Client
npm --workspace server run prisma:generate

# Execute database migrations
npm --workspace server run prisma:migrate

# Seed database with initial users, restaurant profile, and authentic menu items
npm --workspace server run prisma:seed
```

### 5. Run Development Servers

Start both the frontend and backend development servers concurrently:

```bash
npm run dev
```

Once initialized, access the applications at:
- 🌐 **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
- 🔌 **Backend REST API:** [http://localhost:5000/api](http://localhost:5000/api)
- 📑 **Interactive Swagger API Docs:** [http://localhost:5000/docs](http://localhost:5000/docs)

---

## 🔑 Default Demo Credentials

The database seeder automatically initializes three test accounts representing the platform's user roles:

| Role | Email Address | Password | Intended Portal / Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@jaymalhar.com` | `Password@123` | Complete administrative dashboard at `/admin/dashboard` |
| **Seller / Owner** | `seller@jaymalhar.com` | `Password@123` | Kitchen & restaurant controls via `/owner-login` |
| **Customer** | `customer@example.com` | `Password@123` | Regular storefront ordering at `/signin` |

> *All seeded accounts have their email pre-verified (`isEmailVerified: true`).*

---

## 📡 API Documentation & Endpoints

Interactive Swagger documentation is available out of the box at **`http://localhost:5000/docs`**.

### Primary API Routes Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register new customer account | No |
| **POST** | `/api/auth/login` | Authenticate user & receive access/refresh tokens | No |
| **POST** | `/api/auth/refresh-token` | Renew access token using refresh token | No |
| **POST** | `/api/auth/logout` | Clear auth tokens | Yes |
| **GET** | `/api/restaurants` | List restaurants (filterable by city/status) | No |
| **GET** | `/api/restaurants/:id` | Get restaurant profile & menu | No |
| **GET** | `/api/menu` | List menu items (categories, veg/non-veg filter) | No |
| **POST** | `/api/menu` | Add new menu item | Yes (`SELLER`, `ADMIN`) |
| **PUT/DELETE** | `/api/menu/:id` | Update or delete menu item | Yes (`SELLER`, `ADMIN`) |
| **POST** | `/api/orders` | Place a new order with items & delivery address | Yes (`CUSTOMER`) |
| **GET** | `/api/orders/my-orders` | Fetch current user's past and active orders | Yes (`CUSTOMER`) |
| **GET** | `/api/orders/:id` | Get specific order tracking details | Yes (Owner/Customer) |
| **PATCH** | `/api/orders/:id/status` | Advance order status (`ACCEPTED`, `PREPARING`, etc.) | Yes (`SELLER`, `ADMIN`) |
| **GET** | `/api/coupons/validate/:code` | Validate promo code and get discount rate | Yes (`CUSTOMER`) |
| **GET** | `/api/admin/analytics` | Fetch high-level platform business metrics | Yes (`ADMIN`) |
| **POST** | `/api/upload` | Upload image file to Cloudinary | Yes (`SELLER`, `ADMIN`) |

---

## 🧪 Testing & Quality Assurance

Both the client and server include test scaffolds powered by **Vitest**:

```bash
# Run all tests across the monorepo
npm run test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:client

# Perform TypeScript type-checks and linting
npm run lint
```

---

## 🌐 Production Deployment Recommendations

For deploying this platform into production environments:

1. **Frontend (`client`):**
   - Host on [Vercel](https://vercel.com/) or AWS Amplify.
   - Configure environment variable `NEXT_PUBLIC_API_URL` pointing to the public backend domain.
2. **Backend API (`server`):**
   - Deploy on [Render](https://render.com/), [Railway](https://railway.app/), or [AWS ECS/App Runner](https://aws.amazon.com/ecs/).
   - Ensure WebSocket upgrades are enabled on the host/load balancer.
3. **Database (PostgreSQL):**
   - Use managed database services such as [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [AWS RDS](https://aws.amazon.com/rds/).
   - Execute `npx prisma migrate deploy` in your CI/CD deployment pipeline.
4. **Cache & Queues (Redis):**
   - Utilize [Upstash Redis](https://upstash.com/) or managed Redis on your cloud provider.
5. **Media Storage:**
   - Configure real credentials for [Cloudinary](https://cloudinary.com/) or AWS S3 for production image hosting.
6. **Payment Gateway:**
   - Switch `PAYMENT_PROVIDER` to `razorpay` or `stripe` and configure real webhook signature verification.

---

## 📄 Contributing & License

Contributions are welcome! Please create an issue or pull request for any features, bug fixes, or enhancements.

This project is licensed under the **MIT License**.
