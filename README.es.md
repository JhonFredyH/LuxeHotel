> 🌐 > 🌐 [English version](./README.md)

# LuxeHotel — Sistema de Gestión Hotelera

Aplicación web fullstack lista para producción que gestiona reservas hoteleras con control de disponibilidad en tiempo real, previniendo conflictos de concurrencia y overbooking.

🔗 **Demo:** [luxe-hotel-mu.vercel.app](https://luxe-hotel-mu.vercel.app)
🔗 **Documentación API:** [luxehotel-api.onrender.com/docs](https://luxehotel-api.onrender.com/docs)

> ⚠️ Backend en Render Free — la primera carga puede tardar ~30s en despertar el servidor.

![FastAPI](https://img.shields.io/badge/FastAPI-0.129-009688?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat&logo=supabase)
![Cloudinary](https://img.shields.io/badge/Cloudinary-CDN-3448C5?style=flat&logo=cloudinary)

---

## Puntos Clave

- Sistema de reservas en tiempo real con prevención de overbooking
- Gestión de habitaciones por unidad física (no solo tipos de habitación)
- Máquina de estados automática para transiciones de estado de unidades
- Triggers de PostgreSQL para agregación automática de calificaciones
- Panel administrativo con KPIs en vivo: ocupación, ingresos, check-ins
- Autenticación JWT con control de acceso por roles (admin / guest)
- Dockerizado para desarrollo local, desplegado en Render + Vercel + Supabase

---

## Retos Técnicos Resueltos

- Manejo de reservas concurrentes sin conflictos (race conditions)
- Consistencia de datos entre backend y base de datos
- Modelo relacional escalable con integridad referencial
- Sincronización automática del estado de unidades vinculada al ciclo de vida de las reservas
- Compatibilidad IPv4/IPv6 entre Render y Supabase mediante Session Pooler

---

## Tabla de Contenidos

- [Características](#características)
- [Pila Tecnológica](#pila-tecnológica)
- [Arquitectura](#arquitectura)
- [Modelo de Base de Datos](#modelo-de-base-de-datos)
- [Instalación Local](#instalación-local)
- [Variables de Entorno](#variables-de-entorno)
- [Documentación de la API](#documentación-de-la-api)
- [Hoja de Ruta](#hoja-de-ruta)

---

## Características

### Panel de Administración
- Dashboard con KPIs en tiempo real: ingresos, tasa de ocupación, check-ins del día, huéspedes activos
- Gestión completa de reservas: crear, editar, check-in, check-out, cancelar
- Gestión de huéspedes con búsqueda y paginación
- Gestión de habitaciones con filtros por piso y estado

### Sistema de Unidades Físicas
- Cada tipo de habitación tiene unidades físicas individuales (ej: 101, 102, 103...)
- Control de estado por unidad: `available`, `occupied`, `maintenance`, `cleaning`
- El estado se sincroniza automáticamente con el ciclo de vida de las reservas:
  - Crear reserva → unidad pasa a `occupied`
  - Check-out → unidad pasa a `cleaning`
  - Cancelar → unidad vuelve a `available`
- Selección visual de unidad al crear una reserva
- El staff puede cambiar el estado manualmente desde el panel

### Motor de Reservas
- Reservas desde el panel admin con selección visual de unidad
- Reservas públicas sin autenticación (`/guest-booking`)
- Cálculo automático de precios: subtotal + 10% impuestos + 1.4% cargo por servicio
- Validación de capacidad y fechas
- Búsqueda de huéspedes existentes por nombre o email

### Autenticación y Roles
- JWT con roles `admin` y `guest`
- Rutas protegidas por rol en backend y frontend
- Flujos de login independientes para administradores y huéspedes

### Sistema de Reseñas
- Reseñas verificadas (solo huéspedes con estancia confirmada)
- Calificaciones desglosadas: limpieza, comodidad, ubicación, personal, valor
- Ratings agregados actualizados automáticamente por triggers de PostgreSQL — sin lógica en la aplicación
- Filtrado por tipo de viajero

---

## Pila Tecnológica

**Frontend**

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| React | 18.2 | Biblioteca UI |
| React Router | 6 | Navegación SPA |
| Context API | — | Estado global |
| TailwindCSS | 3 | CSS utility-first |
| Axios | — | Cliente HTTP |
| Lucide React | — | Iconos |

**Backend**

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| FastAPI | 0.129 | Framework REST async |
| SQLAlchemy | 2.0 | ORM + Core queries |
| Pydantic | v2 | Validación y serialización |
| Alembic | — | Migraciones versionadas |
| python-jose | — | Codificación JWT |
| bcrypt | — | Hash de contraseñas |

**Infraestructura**

| Tecnología | Rol |
|-----------|-----|
| PostgreSQL 17 | Base de datos principal |
| Supabase | PostgreSQL gestionado (producción) |
| Docker Compose | Orquestación local |
| Render | Hosting del backend |
| Vercel | Hosting del frontend |
| Cloudinary | Almacenamiento de imágenes y CDN |
| UptimeRobot | Monitoreo para mantener el backend activo |

---

## Arquitectura

```
┌─────────────────────────────────────────────────┐
│              FRONTEND                           │
│    React 18 · TailwindCSS · Axios               │
│    Vercel (CDN)                                 │
└──────────────────────┬──────────────────────────┘
                       │ REST / JSON
                       ▼
┌─────────────────────────────────────────────────┐
│              CAPA API                           │
│    FastAPI · Pydantic v2 · JWT Auth             │
│    Docker · Render Free                         │
└──────────────────────┬──────────────────────────┘
                       │ SQLAlchemy 2.0 ORM
                       ▼
┌─────────────────────────────────────────────────┐
│        BASE DE DATOS — PostgreSQL 17            │
│        Supabase (Session Pooler / IPv4)         │
│                                                 │
│  rooms · room_units · reservations · guests     │
│  users · reviews · payments · amenities         │
│                                                 │
│  ★ Triggers automáticos para ratings            │
│  ★ Constraints de integridad referencial        │
└─────────────────────────────────────────────────┘
```

---

## Modelo de Base de Datos

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

★ = Actualizado automáticamente por triggers de PostgreSQL
```

### Máquina de Estados de room_unit

```
available   ──→ occupied      (al crear reserva o check-in)
occupied    ──→ cleaning      (al hacer check-out)
cleaning    ──→ available     (staff confirma limpieza)
available   ──→ maintenance   (staff asigna manualmente)
maintenance ──→ available     (staff resuelve el problema)
```

---

## Instalación Local

**Prerequisitos:** Docker Desktop, Node.js 18+, Python 3.12+, Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/JhonFredyH/LuxeHotel.git
cd LuxeHotel
```

### 2. Configurar variables de entorno
```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

### 3. Levantar el stack completo
```bash
docker compose up --build
```

Esto inicia:
- PostgreSQL en `localhost:5433`
- API backend en `http://localhost:8000`
- Frontend en `http://localhost:5173`
- Swagger docs en `http://localhost:8000/docs`

El backend restaura `Backend/backup.utf8.sql` automáticamente en una base de datos vacía y aplica reparaciones de esquema si es necesario.

### 4. Detener el stack
```bash
docker compose down
```

---

## Variables de Entorno

### Backend (`Backend/.env`)

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DB_USER` | Usuario de PostgreSQL | ✅ |
| `DB_PASSWORD` | Contraseña de PostgreSQL | ✅ |
| `DB_HOST` | Host de PostgreSQL | ✅ |
| `DB_PORT` | Puerto de PostgreSQL | ✅ |
| `DB_NAME` | Nombre de la base de datos | ✅ |
| `SECRET_KEY` | Clave secreta para JWT | ✅ |
| `ALGORITHM` | Algoritmo JWT (default: HS256) | ❌ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token | ❌ |
| `CLOUDINARY_CLOUD_NAME` | Nombre de nube Cloudinary | ✅ |
| `CLOUDINARY_API_KEY` | API key de Cloudinary | ✅ |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary | ✅ |
| `CORS_ORIGINS` | Orígenes permitidos del frontend | ✅ |

### Frontend (`Frontend/.env`)

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_API_URL` | URL base del backend | ✅ |

---

## Documentación de la API

Documentación interactiva completa en `/docs` (Swagger) y `/redoc`.

### Habitaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/rooms` | Listar habitaciones con filtros |
| `GET` | `/rooms/{id}/availability` | Verificar disponibilidad |
| `GET` | `/rooms/{id}/reviews` | Reseñas de una habitación |

### Reservas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/reservations` | Listar reservas con filtros |
| `POST` | `/reservations` | Crear reserva (admin) |
| `PUT` | `/reservations/{id}` | Actualizar reserva |
| `POST` | `/reservations/{id}/checkin` | Realizar check-in |
| `POST` | `/reservations/{id}/checkout` | Realizar check-out |
| `POST` | `/reservations/{id}/cancel` | Cancelar reserva |
| `POST` | `/guest-booking` | Reserva pública sin autenticación |

### Huéspedes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/guests` | Listar huéspedes |
| `POST` | `/guests` | Crear huésped |
| `GET` | `/guests/{id}` | Obtener huésped |
| `PUT` | `/guests/{id}` | Actualizar huésped |
| `DELETE` | `/guests/{id}` | Eliminar huésped |
| `POST` | `/guests/register` | Registro público |
| `POST` | `/guests/login` | Login de huésped |

### Autenticación y Dashboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/login` | Login de administrador |
| `POST` | `/register` | Registro de administrador |
| `GET` | `/dashboard/stats` | KPIs en tiempo real |
| `GET` | `/dashboard/revenue` | Ingresos por día |
| `GET` | `/health` | Health check |

---

## Hoja de Ruta

### ✅ Completado
- Autenticación JWT (roles admin + guest)
- CRUD de habitaciones con amenidades
- Inventario por unidad física (`room_units`)
- Sincronización automática de estados: unidad ↔ reserva
- Selección visual de unidad en el flujo de reserva
- Check-in / check-out / cancelación con actualización de estado
- Reseñas con ratings auto-agregados por triggers
- Panel de administración con KPIs en vivo
- Integración con Cloudinary para imágenes
- Dockerización completa
- Diseño responsive
- Migración a Supabase (base de datos en producción)
- Monitoreo con UptimeRobot

### 🚧 En Progreso
- Sistema de notificaciones por email
- Gráficos de ocupación en el dashboard

### 📋 Planeado
- Integración con Stripe / PayPal
- Multiidioma (i18n)
- PWA (Aplicación Web Progresiva)
- Sistema de descuentos y promociones
- Pruebas automatizadas (Jest, Pytest)
- CI/CD con GitHub Actions
- Caché con Redis

---

## Autor

**Jhon Fredy Hidalgo**
- GitHub: [@JhonFredyH](https://github.com/JhonFredyH)
- LinkedIn: [linkedin.com/in/jhonfredyhidalgo](https://linkedin.com/in/jhonfredyhidalgo)
- Email: jhonfredyha5@gmail.com

