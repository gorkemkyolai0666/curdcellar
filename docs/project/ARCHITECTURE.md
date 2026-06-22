# CurdCellar — Architecture

## System Overview

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────┐
│  Next.js 14     │────▶│  NestJS API         │────▶│ PostgreSQL   │
│  (Vercel)       │     │  (Railway)          │     │ (Railway)    │
│  Port: 3610     │     │  Port: 4610/8080    │     │ Port: 5432   │
└─────────────────┘     └─────────────────────┘     └──────────────┘
```

## Backend Architecture

### Modules
- **AuthModule** — JWT-based authentication (register, login, profile)
- **HealthModule** — Health check endpoint
- **BatchModule** — Cheese production batch CRUD + stats
- **AgingRoomModule** — Aging room management
- **RecipeModule** — Cheese recipe formulas
- **QualityModule** — Quality inspection scoring
- **InventoryModule** — Stock tracking
- **CustomerModule** — B2B customer management
- **OrderModule** — Order lifecycle + revenue stats

### Database Models
- User, Recipe, AgingRoom, Batch, QualityCheck, Inventory, Customer, Order, OrderItem

### API Prefix
All endpoints use `/api` global prefix.

## Frontend Architecture

### Pages
- `/` — Login
- `/dashboard` — Main dashboard
- `/dashboard/batches` — Batch management
- `/dashboard/aging-rooms` — Aging room monitoring
- `/dashboard/recipes` — Recipe library
- `/dashboard/quality` — Quality checks
- `/dashboard/inventory` — Stock management
- `/dashboard/customers` — Customer directory
- `/dashboard/orders` — Order management

### Design System
- **Typography:** DM Sans (body) + JetBrains Mono (data)
- **Colors:** Brand amber (#92400E → #FBBF24), Earth neutrals (#1C1917 → #FAFAF9)
- **Components:** Card-based, rounded-2xl, shadow-sm hover:shadow-md transitions
