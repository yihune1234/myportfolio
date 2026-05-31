# Yihune Belay — Portfolio

[![Live Site](https://img.shields.io/badge/Live-Site-ff8a00?style=for-the-badge&logo=vercel)](https://myportfolio-1-01m7.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github)](https://github.com/yihune1234/myportfolio)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Mobile-119EFF?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)

A modern, full-stack portfolio website built with React, TypeScript, and Node.js — with a native **Android mobile app** powered by Capacitor. One codebase powers both web and mobile.

**Live:** [https://myportfolio-1-01m7.onrender.com/](https://myportfolio-1-01m7.onrender.com/)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Mobile App](#mobile-app)
- [Deployment](#deployment)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Overview

This portfolio serves as both a professional showcase and a technical demonstration. It features:

- **Responsive Web Application** — Deployed on Render, auto-deploys from GitHub
- **Native Android App** — Capacitor wrapper of the same React codebase
- **Admin Dashboard** — Manage projects and messages with JWT authentication
- **Contact Form** — Visitors can send messages directly (stored in MongoDB)
- **Dynamic Projects** — Projects fetched from a MongoDB database via REST API

The entire system uses a **single frontend codebase** — the Android app is simply a Capacitor shell that loads the same React build. Any update to the frontend instantly reflects on both platforms.

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│                  GitHub Repo                      │
│   myportfolio/                                    │
│   ├── frontend/   (React + Vite + Capacitor)      │
│   └── backend/    (Node.js + Express + MongoDB)    │
└──────────────┬───────────────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌────────────┐    ┌──────────────────┐
│   Render   │    │  Android Studio  │
│  (Web App) │    │   (Mobile APK)   │
└────────────┘    └──────────────────┘
```

**Data Flow:**
1. **Frontend** (React) makes HTTP requests to the **Backend API** (Express)
2. **Backend** reads/writes from **MongoDB** (projects, messages, admin users)
3. **Admin Dashboard** uses JWT tokens for authenticated CRUD operations

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite 8** | Build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **React Router** | Client-side routing |
| **TanStack Query** | Server state management |
| **Lucide React** | Icon library |
| **Radix UI** | Accessible UI primitives |
| **React Hook Form** | Form handling |
| **Recharts** | Data visualization |
| **Three.js / React Three Fiber** | 3D graphics |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express** | HTTP server framework |
| **MongoDB + Mongoose** | Database and ODM |
| **JWT (jsonwebtoken)** | Authentication |
| **Bcrypt.js** | Password hashing |
| **Cloudinary + Multer** | File uploads |
| **CORS** | Cross-origin requests |

### Mobile
| Technology | Purpose |
|-----------|---------|
| **Capacitor 8** | Native mobile wrapper |
| **Android SDK** | Native Android build tools |

### DevOps
| Technology | Purpose |
|-----------|---------|
| **Render** | Web deployment (auto-deploy from GitHub) |
| **GitHub** | Source control |
| **npm** | Package management |

---

## Project Structure

```
myportfolio/
├── README.md                      # This file
├── MOBILE-SETUP.md                # Mobile app setup guide
├── .gitignore                     # Git ignore rules
│
├── backend/                       # API server (Express + MongoDB)
│   ├── server.js                  # Express app entry point
│   ├── package.json               # Backend dependencies
│   ├── .env.example               # Environment template
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication middleware
│   │   └── upload.js              # File upload middleware (Multer + Cloudinary)
│   ├── models/
│   │   ├── Admin.js               # Admin user model
│   │   ├── Message.js             # Contact message model
│   │   └── Project.js             # Project model
│   └── routes/
│       ├── admin.js               # Admin management routes
│       ├── authRoutes.js          # Authentication routes
│       ├── messageRoutes.js       # Contact message routes
│       ├── messages.js            # Alternative message routes
│       ├── projectRoutes.js       # Project CRUD routes
│       └── projects.js            # Alternative project routes
│
└── frontend/                      # React web app + Capacitor mobile
    ├── index.html                 # HTML entry point
    ├── package.json               # Frontend dependencies + scripts
    ├── capacitor.config.ts        # Capacitor configuration
    ├── vite.config.ts             # Vite build configuration
    ├── tailwind.config.ts         # Tailwind CSS configuration
    ├── tsconfig.json              # TypeScript configuration
    ├── .env.development           # Local dev environment variables
    ├── .env                       # Production environment variables
    ├── dist/spa/                  # Web build output (gitignored)
    ├── android/                   # Native Android project (auto-generated)
    ├── client/
    │   ├── App.tsx                # React root component
    │   ├── global.css             # Global styles + Tailwind imports
    │   ├── vite-env.d.ts          # Vite type declarations
    │   ├── components/
    │   │   ├── Navigation.tsx     # Sticky navigation bar
    │   │   ├── CloudinaryImage.jsx # Cloudinary image component
    │   │   ├── admin/             # Admin dashboard components
    │   │   │   ├── AdminLogin.jsx
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminSettings.jsx
    │   │   │   ├── MessagesManager.jsx
    │   │   │   └── ProjectsManager.jsx
    │   │   ├── sections/          # Page sections
    │   │   │   ├── HeroSection.tsx
    │   │   │   ├── AboutSection.tsx
    │   │   │   ├── SkillsSection.tsx
    │   │   │   ├── ProjectsSection.tsx
    │   │   │   ├── ExperienceSection.tsx
    │   │   │   ├── EducationSection.tsx
    │   │   │   └── PlatformShowcase.tsx
    │   │   └── ui/                # shadcn/ui components
    │   ├── hooks/
    │   │   ├── useProjects.ts     # Project data hook
    │   │   ├── use-toast.ts       # Toast notification hook
    │   │   └── use-mobile.tsx      # Mobile detection hook
    │   ├── lib/
    │   │   ├── api.ts             # API client + endpoints
    │   │   └── utils.ts           # Utility functions
    │   └── pages/
    │       ├── Index.tsx          # Main landing page
    │       └── NotFound.tsx       # 404 page
    └── public/
        ├── favicon.ico
        └── robots.txt
```

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm**
- **MongoDB** instance (local or Atlas)
- **Android Studio** (only for mobile builds)

### 1. Clone and Install

```bash
git clone https://github.com/yihune1234/myportfolio.git
cd myportfolio
```

#### Backend

```bash
cd backend
cp .env.example .env   # Edit with your MongoDB URI and JWT secret
npm install
npm run dev            # Starts at localhost:5001
```

#### Frontend

```bash
cd frontend
npm install
npm run dev            # Starts at localhost:8080
```

The frontend dev server will proxy API requests to the backend. Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## Available Scripts

### Frontend (`frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server at `localhost:8080` |
| `npm run build` | Build for production + sync Capacitor |
| `npm run build:client` | Build web app only |
| `npm run build:android` | Build web + sync Android native project |
| `npm run cap:sync` | Sync web build to Android |
| `npm run cap:open:android` | Open Android Studio |
| `npm run cap:copy` | Copy web assets to Android |
| `npm run test` | Run Vitest tests |
| `npm run typecheck` | Run TypeScript type checking |

### Backend (`backend/`)

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (hot reload) |

---

## Mobile App

This project includes a fully configured **Android mobile app** using Capacitor. The mobile app uses the exact same React codebase.

### Quick Start

```bash
cd frontend
npm run build:android     # Build web + sync to Android
npx cap open android      # Open in Android Studio
```

From Android Studio, select a device/emulator and click **Run**.

### Live Server Mode

For instant updates without rebuilding, uncomment the `server` section in `capacitor.config.ts`:

```ts
server: {
  url: 'https://myportfolio-1-01m7.onrender.com',
  cleartext: true,
},
```

Then:
```bash
npx cap sync
npx cap open android
```

The app loads content directly from the live site. Every GitHub push → Render redeploy immediately reflects in the app.

### Generating APK

1. `cd frontend && npm run build:android`
2. `npx cap open android`
3. Android Studio → **Build → Build Bundle(s) / APK(s) → Build APK(s)**
4. Find APK at: `frontend/android/app/build/outputs/apk/debug/app-debug.apk`

For detailed instructions, see [MOBILE-SETUP.md](./MOBILE-SETUP.md).

---

## Deployment

### Web (Render)

The frontend is deployed on Render at [https://myportfolio-1-01m7.onrender.com/](https://myportfolio-1-01m7.onrender.com/). Deployments are automatic on every push to the `main` branch.

**Render Build Settings:**
- **Build Command:** `cd frontend && npm install && npm run build:client`
- **Start Command:** `cd frontend && npx serve dist/spa`
- **Publish Directory:** `frontend/dist/spa`

The backend is deployed separately as a Render Web Service.

### Mobile

Mobile APKs are built locally using Android Studio. See [Mobile App](#mobile-app) above.

---

## Features

### Portfolio Sections
- **Hero** — Animated intro with profile card and architecture icons
- **About** — Engineering philosophy and core competencies
- **Skills** — Layered system architecture visualization
- **Projects** — Dynamic project cards fetched from API with detail modals
- **Experience** — Professional timeline with role details
- **Platform Showcase** — Cross-platform capabilities display
- **Education** — Academic background with focus areas
- **Contact** — Working contact form with validation and toast notifications

### Admin Dashboard
- **Secure Login** — JWT-based authentication
- **Project Management** — Create, edit, delete projects (with images via Cloudinary)
- **Message Management** — View and respond to contact form submissions
- **Account Settings** — Update username and password

### Design
- Dark theme with orange/amber accent colors
- Responsive layout (mobile, tablet, desktop)
- Smooth scroll navigation with active section tracking
- Framer Motion animations throughout
- Glassmorphism UI elements with gradient accents

---

## API Endpoints

Base URL: `https://myportfolio-reyk.onrender.com` (production) or `http://localhost:5001` (local)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/admin/login` | Admin login | ❌ |
| `GET` | `/api/admin/profile` | Get admin profile | ✅ |
| `POST` | `/api/admin/username` | Update username | ✅ |
| `POST` | `/api/admin/password` | Update password | ✅ |
| `GET` | `/api/projects` | List all projects | ❌ |
| `GET` | `/api/projects/:id` | Get single project | ❌ |
| `POST` | `/api/projects` | Create project | ✅ |
| `PUT` | `/api/projects/:id` | Update project | ✅ |
| `DELETE` | `/api/projects/:id` | Delete project | ✅ |
| `POST` | `/api/messages` | Submit contact message | ❌ |
| `GET` | `/api/messages` | List messages | ✅ |
| `GET` | `/api/messages/:id` | Get single message | ✅ |
| `DELETE` | `/api/messages/:id` | Delete message | ✅ |
| `PUT` | `/api/messages/:id/read` | Mark message as read | ✅ |
| `GET` | `/api/health` | Health check | ❌ |

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://myportfolio-1-01m7.onrender.com
```

### Frontend (`frontend/.env` / `frontend/.env.development`)

```env
VITE_API_URL=https://myportfolio-reyk.onrender.com
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:5001/api/v1
VITE_USE_MOCK=true
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## Contact

**Yihune Belay**
- **Email:** [yihunebelay859@gmail.com](mailto:yihunebelay859@gmail.com)
- **Phone:** [+251 987 414 282](tel:+251987414282)
- **Location:** Addis Ababa, Ethiopia
- **GitHub:** [yihune1234](https://github.com/yihune1234)
- **LinkedIn:** [Yihune Belay](https://linkedin.com/in/yihune-belay)
- **Website:** [https://myportfolio-1-01m7.onrender.com/](https://myportfolio-1-01m7.onrender.com/)

---

<p align="center">
  Built with React, TypeScript, Node.js, MongoDB & Capacitor<br>
  <sub>© 2024 Yihune Belay. All rights reserved.</sub>
</p>