# 🧱 Tech Stack Overview

Our Story App uses a focused JavaScript stack with managed cloud services for persistence, storage, and deployment.

## 🎨 Frontend

### React + Vite

- Component-based UI development
- Fast local development server
- Optimized production bundles
- Static deployment through Render

### React Router

- Client-side navigation between Home, Timeline, Memories, Love Notes, About, and Login
- Protected routes redirect unauthenticated users to Login

### React Hooks and Context

- `useState` manages form and loading state
- `useEffect` loads dynamic API data
- Auth Context stores the active JWT session
- `localStorage` persists the browser token between refreshes

### React Hot Toast

- Success and error notifications
- Clear feedback for saves, deletes, uploads, and authentication

### Tailwind CSS and Custom Styling

- Responsive layout utilities
- Gradient backgrounds and relationship-focused visual styling
- Loading spinners and image previews
- Staggered timeline card animations
- Reduced-motion support for accessibility

## ⚙️ Backend

### Node.js + Express

- REST API server
- JSON request parsing
- CORS configuration
- Render-compatible `PORT` handling
- Centralized safe error responses

### Prisma ORM

- PostgreSQL client and schema modeling
- Migration management
- Generated database client
- Direct database connection for migrations
- Pooled database connection for runtime queries

### JWT Authentication

- Stateless login sessions
- Bearer-token middleware for private routes
- Seven-day token expiration
- Password hashing with bcrypt

### Zod

- Validates authentication, timeline, note, photo, upload, and memory payloads
- Returns structured field-level validation errors

### Multer and Cloudinary

- Multer parses multipart image uploads in memory
- Cloudinary stores image assets outside the web process
- The API returns hosted image URLs for saved records

### Express Rate Limit

- Login is limited to five attempts per minute
- Helps reduce brute-force authentication attempts

## 🗄 Database

### PostgreSQL with Neon

- Managed cloud PostgreSQL
- Pooled connection for application traffic
- Direct connection for Prisma migrations

### Prisma Models

- `User`
- `Memory`
- `TimelineEvent`
- `LoveNote`
- `Photo`

## ☁️ Deployment

### Render

- Web Service hosts the Express backend
- Static Site hosts the Vite frontend
- Automatic SSL
- Git-based deployments
- Configurable health checks
- Environment variable management

### Neon

- Hosts the production PostgreSQL database
- Supports pooled and direct connection strings
- Provides managed database operations and backup options according to the selected plan

### Cloudinary

- Hosts uploaded timeline and memory images
- Provides durable hosted asset URLs

## 🔧 Development Tools

- Git and GitHub
- Visual Studio Code
- npm
- Prisma CLI
- Prisma Studio
- Browser developer tools
- Render logs
