# CurdCellar — Product Requirements Document

## Overview
CurdCellar is an artisanal cheese production and aging management platform designed for small-to-medium cheese producers in Turkey.

## Target Audience
- Artisanal cheese makers (tulum, kaşar, otlu peynir, gravyer)
- Small dairy cooperatives
- Boutique cheese aging facilities

## Design Direction
**Premium Artisanal** — Warm earth tones (amber, stone, cream), organic feel with sophisticated typography (DM Sans + JetBrains Mono). Card-based layout with emphasis on data visualization.

## Core Features

### 1. Dashboard
- Real-time production metrics (active batches, aging status)
- Revenue overview and order status
- Aging room occupancy visualization

### 2. Batch Management
- Full lifecycle tracking (Production → Aging → Ready → Sold)
- Batch codes, recipe association, milk quantity tracking
- Aging room assignment and duration monitoring

### 3. Aging Room Management
- Temperature and humidity monitoring per room
- Capacity tracking with visual indicators
- Maintenance status tracking

### 4. Recipe Management
- Complete cheese formulas (milk type, aging conditions)
- Step-by-step production instructions
- Production history per recipe

### 5. Quality Control
- Multi-dimensional scoring (texture, flavor, appearance, aroma)
- Pass/fail determination with configurable thresholds
- Inspector tracking and date logging

### 6. Inventory Management
- Stock by cheese type with distribution visualization
- Location tracking within storage
- Automatic stock creation from ready batches

### 7. Customer Management
- B2B customer profiles (restaurants, markets, distributors)
- Contact information and tax ID tracking
- Order history per customer

### 8. Order & Invoicing
- Multi-item orders with automatic total calculation
- Status workflow (Pending → Confirmed → Shipped → Delivered)
- Revenue tracking and analytics

## Technical Stack
- **Backend:** NestJS, Prisma ORM, PostgreSQL
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Infrastructure:** Railway (backend + DB), Vercel (frontend)

## Demo Credentials
- Email: demo@peynirmahzeni.com.tr
- Password: demo123456
