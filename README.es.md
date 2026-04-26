> 🌐 [English version](./README.md)

# LuxeHotel — Sistema de gestión hotelera

Aplicación web fullstack para gestionar reservas hoteleras con control de disponibilidad en tiempo real, previniendo conflictos de concurrencia y sobreventa (overbooking).

🔗 Demo: *(agrega tu link)*
🔗 Documentación API: http://localhost:8000/docs

![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)

---

## 🚀 Puntos clave

- Sistema de reservas en tiempo real
- Prevención de overbooking mediante control de concurrencia
- Gestión de habitaciones por unidad física (no solo tipos)
- Sincronización automática de estados con triggers en PostgreSQL
- Panel administrativo con métricas en vivo (ocupación, ingresos, check-ins)

## ⚙️ Retos técnicos resueltos

- Manejo de múltiples reservas simultáneas sin conflictos
- Evitar condiciones de carrera (race conditions)
- Mantener consistencia entre backend y base de datos
- Diseño de modelo relacional escalable
- Automatización de estados de habitaciones

---

## Tabla de contenidos

- [Características](#características)
- [Pila tecnológica](#pila-tecnológica)
- [Arquitectura](#arquitectura)
- [Modelo de base de datos](#modelo-de-base-de-datos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Documentación de la API](#documentación-de-la-api)
- [Hoja de ruta](#hoja-de-ruta)

---

## Características

### Panel de administración
- Dashboard con métricas en tiempo real (ingresos, ocupación, check-ins del día, huéspedes activos)
- Gestión completa de reservas: crear, editar, check-in, check-out, cancelar
- Gestión de huéspedes con búsqueda y paginación
- Gestión de habitaciones con filtros por piso y estado

### Sistema de habitaciones por unidad
- Cada tipo de habitación tiene unidades físicas individuales (ej: 101, 102, 103...)
- Control de estado por unidad: `available`, `occupied`, `maintenance`, `cleaning`
- Los estados se sincronizan automáticamente con las reservas:
  - Crear reserva → unidad pasa a `occupied`
  - Check-out → unidad pasa a `cleaning`
  - Cancelar → unidad vuelve a `available`
- Al crear una reserva, solo se pueden seleccionar unidades disponibles
- El staff puede cambiar el estado manualmente desde el panel

### Motor de reservas
- Reservas desde el panel admin con selección visual de unidad
- Reservas públicas sin autenticación (`/guest-booking`)
- Cálculo automático de precios: subtotal + 10% impuestos + 1.4% cargo por servicio
- Validación de capacidad y fechas
- Búsqueda de huéspedes existentes por nombre o email

### Autenticación y roles
- JWT con roles: `admin` y `guest`
- Rutas protegidas por rol en backend y frontend
- Login independiente para administradores y huéspedes

### Sistema de reviews
- Reseñas verificadas (solo huéspedes con reserva confirmada)
- Calificaciones desglosadas: limpieza, comodidad, ubicación, personal, valor
- Ratings agregados actualizados automáticamente con triggers de PostgreSQL — sin lógica en aplicación
- Filtrado por tipo de viajero

---

## Pila tecnológica

**Frontend**

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| React | 18.2 | UI library |
| React Router | 6 | Navegación SPA |
| Context API | — | Estado global |
| TailwindCSS | 3 | Utility-first CSS |
| Lucide React | — | Iconos |

**Backend**

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| FastAPI | 0.104 | Framework async |
| SQLAlchemy | 2.0 | ORM + Core queries |
| Pydantic | 2 | Validación y serialización |
| Alembic | — | Migraciones versionadas |
| python-jose | — | JWT encoding/decoding |

**Infraestructura**

| Tecnología | Rol |
|-----------|-----|
| PostgreSQL 17 | Base de datos principal |
| Docker Compose | Orquestación local |
| Cloudinary | Almacenamiento y CDN de imágenes |

---

## Arquitectura

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
│  ★ Triggers automáticos para ratings            │
│  ★ Constraints de integridad referencial        │
└─────────────────────────────────────────────────┘
```

El backend expone una API REST stateless. Toda la lógica de negocio (cálculo de precios, validación de disponibilidad, transiciones de estado) vive en la capa de servicio de FastAPI, no en el frontend ni en stored procedures ad-hoc.

---

## Modelo de base de datos

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

★ = Actualizado automáticamente por triggers de PostgreSQL
```

### Máquina de estados de room_unit

```
available ──→ occupied     (al crear reserva o check-in)
occupied  ──→ cleaning     (al hacer check-out)
cleaning  ──→ available    (staff confirma limpieza)
available ──→ maintenance  (staff asigna manualmente)
maintenance ──→ available  (staff resuelve el problema)
```

---

## Instalación

**Prerequisitos:** Docker Desktop, Node.js 18+, Python 3.12+, Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/luxehotel.git
cd luxehotel
```

### 2. Configurar variables de entorno
```bash
cp Backend/.env.example Backend/.env
cp Frontend/.env.example Frontend/.env
```

### 3. Levantar todo el stack
```bash
docker compose up --build
```

Esto inicia:
- PostgreSQL en `localhost:5433`
- API backend en `http://localhost:8000`
- Frontend en `http://localhost:5173`
- Swagger docs en `http://localhost:8000/docs`

El backend en Docker restaura `Backend/backup.utf8.sql` automáticamente cuando la base está vacía y luego aplica la reparación de esquema si hace falta.

### 4. Detener el stack
```bash
docker compose down
```

### 5. Helpers opcionales para Windows
```bash
scripts\docker-up.cmd
scripts\docker-down.cmd
```

---

## Variables de entorno

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

### Frontend (`Frontend/.env`)

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_API_URL` | URL base del backend | ✅ |

---

## Documentación de la API

Documentación interactiva completa en `http://localhost:8000/docs`.

### Habitaciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/rooms` | Listar habitaciones con filtros |
| `GET` | `/rooms-admin` | Listar habitaciones con room_numbers (admin) |
| `GET` | `/rooms-admin/stats` | Conteo de unidades por estado |
| `GET` | `/rooms-admin/floors` | Pisos disponibles |
| `GET` | `/rooms-admin/{room_id}/units` | Unidades físicas de un tipo |
| `POST` | `/rooms-admin/{room_id}/units` | Crear unidad |
| `PATCH` | `/rooms-admin/units/{unit_id}/status` | Cambiar estado de unidad |
| `DELETE` | `/rooms-admin/units/{unit_id}` | Eliminar unidad |
| `GET` | `/rooms/{room_id}/reviews` | Reviews de una habitación |

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

### Autenticación y dashboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/login` | Login de administrador |
| `POST` | `/register` | Registro de administrador |
| `GET` | `/dashboard/stats` | KPIs del dashboard |
| `GET` | `/dashboard/revenue` | Ingresos por día |

---

## Hoja de ruta

### ✅ Completado
- Autenticación JWT (admin + guest)
- CRUD de habitaciones con amenidades
- Control de inventario por unidad física (`room_units`)
- Sincronización automática de estados unidad ↔ reserva
- Sistema de reservas con selección visual de unidad
- Check-in / check-out / cancelación con actualización de estado
- Reviews y calificaciones con triggers automáticos
- Panel de administración con dashboard de métricas
- KPI cards de ocupación por unidad real
- Integración con Cloudinary para imágenes
- Dockerización completa
- Diseño responsive

### 🚧 En progreso
- Sistema de notificaciones por email
- Mejoras al dashboard (gráficos de ocupación)

### 📋 Planeado
- Integración con Stripe / PayPal
- Multiidioma (i18n)
- PWA (Aplicación web progresiva)
- Sistema de descuentos y promociones
- Pruebas automatizadas (Jest, Pytest)
- CI/CD con GitHub Actions
- Redis para caché

---

## Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/NuevaFuncionalidad`
3. Commit: `git commit -m 'Add NuevaFuncionalidad'`
4. Push: `git push origin feature/NuevaFuncionalidad`
5. Abre un Pull Request

---

## Licencia

MIT — ver archivo `LICENSE` para más detalles.

---

## Autor

**Tu nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu nombre](https://linkedin.com)
- Email: jhonfredyha@gmail.com
