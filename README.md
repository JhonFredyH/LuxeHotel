> 🌐 [Versión en Español](./README.es.md)

# LuxeHotel — Hotel Management System

A production-ready fullstack web application for managing hotel reservations with real-time availability control, preventing concurrency conflicts and overbooking.

🔗 **Live Demo:** [luxe-hotel-mu.vercel.app](https://luxe-hotel-mu.vercel.app)
🔗 **API Docs:** [luxehotel-api.onrender.com/docs](https://luxehotel-api.onrender.com/docs)

> ⚠️ Backend hosted on Render Free — first load may take ~30s to wake up.

![FastAPI](https://img.shields.io/badge/FastAPI-0.129-009688?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=flat&logo=cloudinary)

---

## Key Highlights

- Real-time reservation system with overbooking prevention
- Physical room unit management (not just room types)
- Automatic state machine for room status transitions
- PostgreSQL triggers for automatic rating aggregation
- Admin dashboard with live KPIs: occupancy, revenue, check-ins
- JWT authentication with role-based access (admin / guest)
- Dockerized for local development, deployed on Render + Vercel + Supabase

---

## Technical Challenges Solved

- Handling concurrent reservations without conflicts (race conditions)
- Enforcing data consistency between backend and database
- Scalable relational model with referential integrity
- Automatic room unit status sync tied to reservation lifecycle
- IPv4/IPv6 connection compatibility between Render and Supabase via Session Pooler

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Model](#database-model)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)

---

## Features

### Admin Panel
- Dashboard with real-time KPIs: revenue, occupancy rate, daily check-ins, active guests
- Full reservation management: create, edit, check-in, check-out, cancel
- Guest management with search and pagination
- Room management with floor and status filters

### Physical Room Unit System
- Each room type has individual physical units (e.g., 101, 102, 103...)
- Per-unit status control: `available`, `occupied`, `maintenance`, `cleaning`
- Status auto-syncs with reservation lifecycle:
  - Create reservation → unit becomes `occupied`
  - Check-out → unit becomes `cleaning`
  - Cancel → unit returns to `available`
- Visual unit selection when creating a reservation
- Staff can manually override unit status from the panel

### Booking Engine
- Admin reservations with visual unit selection
- Public guest booking without authentication (`/guest-booking`)
- Automatic pricing: subtotal + 10% taxes + 1.4% service fee
- Capacity and date validation
- Guest lookup by name or email

### Auth & Roles
- JWT with `admin` and `guest` roles
- Role-protected routes on both backend and frontend
- Separate login flows for administrators and guests

### Review System
- Verified reviews (guests with confirmed stay only)
- Breakdown ratings: cleanliness, comfort, location, staff, value
- Aggregate ratings updated automatically via PostgreSQL triggers — no application logic needed
- Filter by traveler type

---

## Tech Stack

**Frontend**

| Technology | Version | Role |
|-----------|---------|------|
| React | 18.2 | UI library |
| React Router | 6 | SPA navigation |
| Context API | — | Global state |
| TailwindCSS | 3 | Utility-first CSS |
| Axios | — | HTTP client |
| Lucide React | — | Icons |

**Backend**

| Technology | Version | Role |
|-----------|---------|------|
| FastAPI | 0.129 | Async REST framework |
| SQLAlchemy | 2.0 | ORM + Core queries |
| Pydantic | v2 | Validation & serialization |
| Alembic | — | Versioned migrations |
| python-jose | — | JWT encoding/decoding |
| bcrypt | — | Password hashing |

**Infrastructure**

| Technology | Role |
|-----------|------|
| PostgreSQL 17 | Primary database |
| Supabase | Managed PostgreSQL (production) |
| Docker Compose | Local orchestration |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| Cloudinary | Image storage & CDN |
| UptimeRobot | Backend keep-alive monitoring |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              FRONTEND                           │
│    React 18 · TailwindCSS · Axios               │
│    Vercel (CDN)                                 │
└──────────────────────┬──────────────────────────┘
                       │ REST / JSON
                       ▼
┌─────────────────────────────────────────────────┐
│              API LAYER                          │
│    FastAPI · Pydantic v2 · JWT Auth             │
│    Docker · Render Free                         │
└──────────────────────┬──────────────────────────┘
                       │ SQLAlchemy 2.0 ORM
                       ▼
┌─────────────────────────────────────────────────┐
│        DATABASE — PostgreSQL 17                 │
│        Supabase (Session Pooler / IPv4)         │
│                                                 │
│  rooms · room_units · reservations · guests     │
│  users · reviews · payments · amenities         │
│                                                 │
│  ★ Auto triggers for ratings                    │
│  ★ Referential integrity constraints            │
└─────────────────────────────────────────────────┘
```

---

## Database Model

```
┌─────────────┐       ┌──────────────┐       ┌──────────────────┐
│    users    │       │    guests    │       │      rooms       │
├─────────────┤       ├──────────────┤       ├──────────────────┤
│ id (PK)     │       │ id (PK)      │       │ id (PK)          │
│ email       │       │ first_name   │       │ name             │
│ password    │       │ last_name    │       │ price_per_night  │
│ role        │       │ email        │       │ floor            │
└─────────────┘       │ phone        │       │ quantity         │
                      └──────┬───────┘       │ rating ★         │
                             │               └────────┬─────────┘
                             │                        │
                             │               ┌────────▼─────────┐
                             │               │   room_units     │
                             │               ├──────────────────┤
                             │               │ id (PK)          │
                             │               │ room_id (FK)     │
                             │               │ unit_number      │
                             │               │ status           │
                             │               └──────────────────┘
                             │
                      ┌──────▼───────────────┐
                      │     reservations     │
                      ├──────────────────────┤
                      │ id (PK)              │
                      │ guest_id (FK)        │
                      │ room_id (FK)         │
                      │ check_in_date        │
                      │ check_out_date       │
                      │ status               │
                      │ total_amount         │
                      └──────────┬───────────┘
                                 │
                      ┌──────────▼───────────┐
                      │       reviews        │
                      ├──────────────────────┤
                      │ id (PK)              │
                      │ room_id (FK)         │
                      │ guest_id (FK)        │
                      │ rating_overall ★     │
                      │ comment              │
                      │ verified             │
                      └──────────────────────┘

★ = Updated automatically by PostgreSQL triggers
```

### Room Unit State Machine

```
available   ──→ occupied      (on reservation create or check-in)
occupied    ──→ cleaning      (on check-out)
cleaning    ──→ available     (staff confirms cleaning)
available   ──→ maintenance   (staff assigns manually)
maintenance ──→ available     (staff resolves issue)
```

---

## Local Setup

**Prerequisites:** Docker Desktop, Node.js 18+, Python 3.12+, Git

### 1. Clone the repository
```bash
git clone https://github.com/JhonFredyH/LuxeHotel.git
cd LuxeHotel
```

### 2. Configure environment variables
```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

### 3. Start the full stack
```bash
docker compose up --build
```

This starts:
- PostgreSQL on `localhost:5433`
- Backend API on `http://localhost:8000`
- Frontend on `http://localhost:5173`
- Swagger docs on `http://localhost:8000/docs`

The backend automatically restores `Backend/backup.utf8.sql` on a fresh database and applies schema repairs if needed.

### 4. Stop the stack
```bash
docker compose down
```

---

## Environment Variables

### Backend (`Backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_USER` | PostgreSQL user | ✅ |
| `DB_PASSWORD` | PostgreSQL password | ✅ |
| `DB_HOST` | PostgreSQL host | ✅ |
| `DB_PORT` | PostgreSQL port | ✅ |
| `DB_NAME` | Database name | ✅ |
| `SECRET_KEY` | JWT secret key | ✅ |
| `ALGORITHM` | JWT algorithm (default: HS256) | ❌ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | ❌ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `CORS_ORIGINS` | Allowed frontend origins | ✅ |

### Frontend (`Frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend base URL | ✅ |

---

## API Reference

Full interactive docs at `/docs` (Swagger) and `/redoc`.

### Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rooms` | List rooms with filters |
| `GET` | `/rooms/{id}/availability` | Check room availability |
| `GET` | `/rooms/{id}/reviews` | Room reviews |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reservations` | List reservations with filters |
| `POST` | `/reservations` | Create reservation (admin) |
| `PUT` | `/reservations/{id}` | Update reservation |
| `POST` | `/reservations/{id}/checkin` | Check-in |
| `POST` | `/reservations/{id}/checkout` | Check-out |
| `POST` | `/reservations/{id}/cancel` | Cancel reservation |
| `POST` | `/guest-booking` | Public booking (no auth) |

### Guests

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/guests` | List guests |
| `POST` | `/guests` | Create guest |
| `GET` | `/guests/{id}` | Get guest |
| `PUT` | `/guests/{id}` | Update guest |
| `DELETE` | `/guests/{id}` | Delete guest |
| `POST` | `/guests/register` | Public registration |
| `POST` | `/guests/login` | Guest login |

### Auth & Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Admin login |
| `POST` | `/register` | Admin registration |
| `GET` | `/dashboard/stats` | Live KPIs |
| `GET` | `/dashboard/revenue` | Revenue by day |
| `GET` | `/health` | Health check |

---

## Roadmap

### ✅ Completed
- JWT auth (admin + guest roles)
- Room CRUD with amenities
- Physical unit inventory (`room_units`)
- Automatic state sync: unit ↔ reservation
- Visual unit selection in reservation flow
- Check-in / check-out / cancel with state updates
- Reviews with auto-aggregated ratings via triggers
- Admin dashboard with live KPIs
- Cloudinary image integration
- Full Docker setup
- Responsive design
- Supabase migration (production database)
- UptimeRobot monitoring

### 🚧 In Progress
- Email notification system
- Dashboard charts (occupancy over time)

### 📋 Planned
- Stripe / PayPal integration
- i18n (multilanguage)
- PWA support
- Discount and promo system
- Automated tests (Jest, Pytest)
- CI/CD with GitHub Actions
- Redis caching

---

## Author

**Jhon Fredy Hidalgo**
- GitHub: [@JhonFredyH](https://github.com/JhonFredyH)
- LinkedIn: [linkedin.com/in/jhonfredyhidalgo](https://linkedin.com/in/jhonfredyhidalgo)
- Email: jhonfredyha5@gmail.com
