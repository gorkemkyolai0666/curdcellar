# CurdCellar — Deployment Guide

## Live URLs
- **Frontend (Vercel):** https://curdcellar.vercel.app
- **Backend (Railway):** https://curdcellar-backend-production.up.railway.app/api
- **Health Check:** https://curdcellar-backend-production.up.railway.app/api/health

## Bulut Canlı Önizleme Linki
- **Google IDX:** https://idx.google.com/import?url=https://github.com/gorkemkyolai0666/curdcellar

## Demo Credentials
- **Email:** demo@peynirmahzeni.com.tr
- **Password:** demo123456

## Infrastructure

### Railway (Backend + PostgreSQL)
- Backend service: curdcellar-backend
- PostgreSQL 16 service
- Auto-deploy from main branch (`backend/` root directory)

### Vercel (Frontend)
- Framework: Next.js
- Root directory: `frontend/`
- Auto-deploy from main branch

## Environment Variables

### Backend (Railway)
| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string (internal) |
| JWT_SECRET | JWT signing secret |
| PORT | 8080 (Railway default) |
| FRONTEND_URL | https://curdcellar.vercel.app |

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_API_URL | Railway backend URL with /api |

## CI/CD Pipeline
1. Push to main triggers CI workflow
2. Backend: install → migrate → seed → build → test → integration
3. Frontend: install → build
4. Provision job: Railway + Vercel infra setup (only on main push)

## Required GitHub Organization Secrets
- `GH_PAT` — GitHub Personal Access Token
- `RAILWAY_API_TOKEN` — Railway API token
- `VERCEL_TOKEN` — Vercel deployment token
- `JWT_SECRET` — Production JWT signing key
