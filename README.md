> 🌐 [Versión en español](./README.es.md)

# LuxeHotel — Hotel Management System

Full-stack web application for managing hotel reservations with real-time availability control, preventing concurrency conflicts and overbooking.

🔗 Demo: [luxe-hotel-mu.vercel.app](https://luxe-hotel-mu.vercel.app/)  
📖 API Docs: [tu-api.onrender.com/docs](https://tu-api.onrender.com/docs)  
🔑 Admin Panel: [luxe-hotel-mu.vercel.app/login](https://luxe-hotel-mu.vercel.app/login)

> **Test credentials:** `admin@luxehotel.com` / `admin123`  
> ⚠️ The API may take ~30s to wake up (free Render instance)

![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)

---

## 🚀 Key highlights

- Real-time reservation system
- Overbooking prevention through concurrency control
- Room management by individual physical unit (not just room types)
- Automatic state synchronization with PostgreSQL triggers
- Admin panel with live metrics (occupancy, revenue, check-ins)

## ⚙️ Technical challenges solved

- Handling multiple simultaneous reservations without conflicts
- Avoiding race conditions
- Maintaining consistency between backend and database
- Scalable relational data model design
- Automated room state management

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Database model](#database-model)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Roadmap](#roadmap)

---

## Features

### Admin panel
- Dashboard with real-time metrics (revenue, occupancy, daily check-ins, active guests)
- Full reservation management: create, edit, check-in, check-out, cancel
- Guest management with search and pagination
- Room management with filters by floor and status

### Per-unit room system
- Each room type has individual physical units (e.g. 101, 102, 103...)
- State control per unit: `available`, `occupied`, `maintenance`, `cleaning`
- States sync automatically with the reservation lifecycle:
  - Create reservation → unit moves to `occupied`
  - Check-out → unit moves to `cleaning`
  - Cancel → unit returns to `available`
- Only available units can be selected when creating a reservation
- Staff can change unit state manually from the panel

### Reservation engine
- Admin-panel reservations with visual unit selection
- Public booking without authentication (`/guest-booking`)
- Automatic price calculation: subtotal + 10% taxes + 1.4% service fee
- Capacity and date validation
- Search for existing guests by name or email

### Authentication and roles
- JWT with roles: `admin` and `guest`
- Role-protected routes on both frontend and backend
- Independent login flows for staff and guests

### Review system
- Verified reviews (only guests with a confirmed reservation)
- Breakdown ratings: cleanliness, comfort, location, staff, value
- Aggregate ratings auto-updated via PostgreSQL triggers — no application logic needed
- Filtering by traveler type

---

## Tech stack

**Frontend**

| Technology | Version | Role |
|-----------|---------|------|
| React | 18.2 | UI library |
| React Router | 6 | SPA navigation |
| Context API | — | Global state |
| TailwindCSS | 3 | Utility-first CSS |
| Lucide React | — | Icons |

**Backend**

| Technology | Version | Role |
|-----------|---------|------|
| FastAPI | 0.104 | Async web framework |
| SQLAlchemy | 2.0 | ORM + Core queries |
| Pydantic | 2 | Validation and serialization |
| Alembic | — | Versioned migrations |
| python-jose | — | JWT encoding/decoding |

**Infrastructure**

| Technology | Role |
|-----------|------|
| PostgreSQL 17 | Primary database |
| Docker Compose | Local orchestration |
| Cloudinary | Image storage and CDN |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              FRONTEND                           │
│    React 18 · TailwindCSS · Context API         │
└──────────────────────┬──────────────────────────┘
                       │ REST / JSON
                       ▼
┌─────────────────────────────────────────────────┐
│              API LAYER                          │
│    FastAPI · Pydantic v2 · JWT Auth             │
│    Dependency Injection · Background Tasks      │
└──────────────────────┬──────────────────────────┘
                       │ SQLAlchemy 2.0 ORM
                       ▼
┌─────────────────────────────────────────────────┐
│           DATABASE — PostgreSQL 17              │
│  rooms · room_units · reservations · guests     │
│  users · reviews · payments · amenities         │
│                                                 │
│  ★ Automatic triggers for ratings               │
│  ★ Referential integrity constraints            │
└─────────────────────────────────────────────────┘
```

The backend exposes a stateless REST API. All business logic (price calculation, availability validation, state transitions) lives in the FastAPI service layer — not in the frontend or ad-hoc stored procedures.

---

## Database model

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
                             │               │ status           │
                             │               └────────┬─────────┘
                             │                        │
                             │               ┌────────▼─────────┐
                             │               │   room_units     │
                             │               ├──────────────────┤
                             │               │ id (PK)          │
                             │               │ room_id (FK)     │
                             │               │ unit_number      │
                             │               │ status           │
                             │               │ notes            │
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

★ = Auto-updated by PostgreSQL triggers
```

### Room unit state machine

```
available ──→ occupied    (on reservation create or check-in)
occupied  ──→ cleaning    (on check-out)
cleaning  ──→ available   (staff confirms cleaning)
available ──→ maintenance (staff assigns manually)
maintenance ──→ available (staff resolves issue)
```

---

## Quick start

**Prerequisites:** Docker Desktop, Node.js 18+, Python 3.12+, Git

### 1. Clone the repository
```bash
git clone https://github.com/your-username/luxehotel.git
cd luxehotel
```

### 2. Set up environment variables
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
- API backend on `http://localhost:8000`
- Frontend on `http://localhost:5173`
- Swagger docs on `http://localhost:8000/docs`

The Docker backend restores `Backend/backup.utf8.sql` automatically on a fresh database and then applies the schema repair script when needed.

### 4. Stop the stack
```bash
docker compose down
```

### 5. Optional Windows helpers
```bash
scripts\docker-up.cmd
scripts\docker-down.cmd
```

---

## Environment variables

### Backend (`Backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_USER` | PostgreSQL username | ✅ |
| `DB_PASSWORD` | PostgreSQL password | ✅ |
| `DB_HOST` | PostgreSQL host | ✅ |
| `DB_PORT` | PostgreSQL port | ✅ |
| `DB_NAME` | PostgreSQL database name | ✅ |
| `SECRET_KEY` | Secret key for JWT signing | ✅ |
| `ALGORITHM` | JWT algorithm (default: HS256) | ❌ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | ❌ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |

### Frontend (`Frontend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend base URL | ✅ |

---

## API reference

Full interactive documentation at `http://localhost:8000/docs`.

### Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rooms` | List rooms with filters |
| `GET` | `/rooms-admin` | List rooms with unit numbers (admin) |
| `GET` | `/rooms-admin/stats` | Unit count by status |
| `GET` | `/rooms-admin/floors` | Available floors |
| `GET` | `/rooms-admin/{room_id}/units` | Physical units for a room type |
| `POST` | `/rooms-admin/{room_id}/units` | Create unit |
| `PATCH` | `/rooms-admin/units/{unit_id}/status` | Change unit status |
| `DELETE` | `/rooms-admin/units/{unit_id}` | Delete unit |
| `GET` | `/rooms/{room_id}/reviews` | Reviews for a room |

### Reservations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reservations` | List reservations with filters |
| `POST` | `/reservations` | Create reservation (admin) |
| `PUT` | `/reservations/{id}` | Update reservation |
| `POST` | `/reservations/{id}/checkin` | Perform check-in |
| `POST` | `/reservations/{id}/checkout` | Perform check-out |
| `POST` | `/reservations/{id}/cancel` | Cancel reservation |
| `POST` | `/guest-booking` | Public booking without authentication |

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

### Auth and dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Admin login |
| `POST` | `/register` | Admin registration |
| `GET` | `/dashboard/stats` | Dashboard KPIs |
| `GET` | `/dashboard/revenue` | Revenue by day |

---

## Roadmap

### ✅ Done
- JWT authentication (admin + guest)
- Room CRUD with amenities
- Inventory control by physical unit (`room_units`)
- Automatic unit ↔ reservation state sync
- Reservation system with visual unit selection
- Check-in / check-out / cancellation with state updates
- Reviews and ratings with automatic triggers
- Admin panel with metrics dashboard
- Occupancy KPI cards based on real units
- Cloudinary integration for images
- Full Dockerization
- Responsive design

### 🚧 In progress
- Email notification system
- Dashboard improvements (occupancy charts)

### 📋 Planned
- Stripe / PayPal integration
- Internationalization (i18n)
- PWA support
- Discount and promotions system
- Automated testing (Jest, Pytest)
- CI/CD with GitHub Actions
- Redis caching

---

## Contributing

1. Fork the project
2. Create your branch: `git checkout -b feature/NewFeature`
3. Commit: `git commit -m 'Add NewFeature'`
4. Push: `git push origin feature/NewFeature`
5. Open a Pull Request

---

## License

MIT — see `LICENSE` file for details.

---

## Author

**Your name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your name](https://linkedin.com)
- Email: jhonfredyha@gmail.com
