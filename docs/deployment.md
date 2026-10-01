# 🚀 Deployment Guide

This guide describes the production deployment of Our Story App using Render, Neon, and Cloudinary.

## 🧩 Backend Deployment

Create a Render Web Service connected to the GitHub repository.

### Service Settings

- Root directory: `backend/node`
- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/health`

The current backend URL is:

```text
https://our-story-backend-wsog.onrender.com
```

### Environment Variables

Configure these in the Render service settings. Do not commit them to GitHub.

```env
DATABASE_URL=your-pooled-neon-url
DIRECT_DATABASE_URL=your-direct-neon-url
JWT_SECRET=your-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Database Migrations

Run migrations explicitly before deploying schema changes:

```bash
cd backend/node
npm run migrate
```

The application start command launches the web service independently:

```bash
npm start
```

This keeps temporary database migration connectivity problems from preventing the health endpoint and web process from starting.

## 🎨 Frontend Deployment

Create a Render Static Site connected to the same repository.

### Site Settings

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`

### Environment Variable

```env
VITE_API_URL=https://our-story-backend-wsog.onrender.com
```

Vite creates the production bundle in `frontend/dist/`.

## 🗄 Neon Database

1. Create a PostgreSQL database in Neon.
2. Store the pooled connection string as `DATABASE_URL`.
3. Store the non-pooler connection string as `DIRECT_DATABASE_URL`.
4. Run Prisma migrations with `npm run migrate`.
5. Keep both connection strings in Render environment settings and local ignored env files only.

## ☁️ Cloudinary

Create a Cloudinary account and configure the cloud name, API key, and API secret in Render. The backend uploads images into the `our-story/timeline` and `our-story/memories` folders.

## 🩺 Health Monitoring

Configure Render Health Checks with:

- Path: `/health`
- Expected status: `200`
- Timeout: `1000ms`
- Interval: `10s`

The endpoint returns `OK` without querying the database.

## 🔒 Deployment Checklist

- [ ] Set all Render environment variables
- [ ] Confirm `DATABASE_URL` uses the pooled Neon host
- [ ] Confirm `DIRECT_DATABASE_URL` uses the direct Neon host
- [ ] Run `npm run migrate` for pending migrations
- [ ] Confirm `/health` returns `200`
- [ ] Confirm the frontend `VITE_API_URL` points to the deployed backend
- [ ] Confirm `backend/node/prisma/.env` is ignored by Git
- [ ] Enable automatic deploys after successful builds
