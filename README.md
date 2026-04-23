# LuxeHotel — Hotel Management System

Aplicación web fullstack diseñada para gestionar reservas hoteleras con control de disponibilidad en tiempo real, evitando conflictos de concurrencia y sobreventa (overbooking).

🔗 Demo: (agrega tu link)  
🔗 Documentación API: http://localhost:8000/docs  


![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)


## 🚀 Puntos clave

- Sistema de reservas en tiempo real
- Prevención de overbooking mediante control de concurrencia
- Gestión de habitaciones por unidad física (no solo tipos)
- Sincronización automática de estados con triggers en PostgreSQL
- Panel administrativo con métricas en vivo (ocupación, ingresos, check-ins)

## ⚙️ Retos técnicos

- Manejo de múltiples reservas simultáneas sin conflictos
- Evitar condiciones de carrera (race conditions)
- Mantener consistencia entre backend y base de datos
- Diseño de modelo relacional escalable
- Automatización de estados de habitaciones

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

### Sistema de reservas
- Reservas desde el panel admin con selección visual de unidad
- Reservas públicas sin autenticación (`/guest-booking`)
- Cálculo automático de precios: subtotal + 10% impuestos + 1.4% servicio
- Validación de capacidad y fechas
- Búsqueda de huéspedes existentes por nombre o email

### Autenticación y roles
- JWT con roles: `admin` y `guest`
- Rutas protegidas por rol
- Login independiente para administradores y huéspedes

### Sistema de reviews
- Reseñas verificadas (solo huéspedes con reserva confirmada)
- Calificaciones desglosadas: limpieza, comodidad, ubicación, personal, valor
- Actualización automática de ratings con triggers de PostgreSQL
- Categorización por tipo de viajero

---

## Pila tecnológica

**Frontend**
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 18.2 | UI Library |
| React Router | 6 | Navegación |
| Context API | — | State Management |
| TailwindCSS | 3 | Estilos |
| Lucide React | — | Iconos |

**Backend**
| Tecnología | Versión | Uso |
|-----------|---------|-----|
| FastAPI | 0.104 | Framework web |
| SQLAlchemy | 2.0 | ORM |
| Pydantic | 2 | Validación |
| Alembic | — | Migraciones |
| JWT | — | Autenticación |

**Infraestructura**
| Tecnología | Uso |
|-----------|-----|
| PostgreSQL 17 | Base de datos principal |
| Docker Compose | Orquestación local |
| Cloudinary | CDN e imágenes |

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│         React + TailwindCSS + Context API                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  API LAYER (FastAPI)                        │
│         Endpoints · JWT Auth · Pydantic Validation          │
└────────────────────────┬────────────────────────────────────┘
                         │ SQLAlchemy ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                DATABASE (PostgreSQL 17)                     │
│  rooms · room_units · reservations · guests · reviews       │
│  users · payments · room_amenities                          │
│                  + Triggers automáticos ⭐                  │
└─────────────────────────────────────────────────────────────┘
```

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
                      └──────┬───────┘       │ rating ⭐        │
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
                      │ special_requests*    │
                      └──────────┬───────────┘
                                 │
                      ┌──────────▼───────────┐
                      │       reviews        │
                      ├──────────────────────┤
                      │ id (PK)              │
                      │ room_id (FK)         │
                      │ guest_id (FK)        │
                      │ rating_overall ⭐    │
                      │ comment              │
                      │ verified             │
                      └──────────────────────┘

⭐ = Actualizado automáticamente por triggers de PostgreSQL
* room_number se almacena dentro de special_requests con prefijo room_number::
```

### Estados de room_unit

```
available ──→ occupied  (al crear reserva o check-in)
occupied  ──→ cleaning  (al hacer check-out)
cleaning  ──→ available (staff confirma limpieza)
available ──→ maintenance (staff asigna manualmente)
maintenance ──→ available (staff resuelve)
```

---

## Instalación

### Requisitos previos
- Docker Desktop
- Node.js 18+
- Python 3.12+
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/luxehotel.git
cd luxehotel
```

### 2. Configurar variables de entorno
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Levantar el backend con Docker
```bash
cd backend
docker-compose up -d
```

Esto levanta:
- PostgreSQL en `localhost:5433`
- API backend en `http://localhost:8000`
- Docs Swagger en `http://localhost:8000/docs`

### 4. Instalar y correr el frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`

### 5. Activar migraciones (primera vez)
```bash
cd backend
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac
alembic stamp head
```

---

## Variables de entorno

### Backend (`backend/.env`)
| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `DATABASE_URL` | URL de conexión PostgreSQL | ✅ |
| `SECRET_KEY` | Clave secreta para JWT | ✅ |
| `ALGORITHM` | Algoritmo JWT (default: HS256) | ❌ |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token | ❌ |
| `CLOUDINARY_CLOUD_NAME` | Nombre de nube Cloudinary | ✅ |
| `CLOUDINARY_API_KEY` | API key de Cloudinary | ✅ |
| `CLOUDINARY_API_SECRET` | API secret de Cloudinary | ✅ |

### Frontend (`frontend/.env`)
| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_API_URL` | URL del backend | ✅ |

---

## Documentación de la API

La documentación interactiva completa está disponible en `http://localhost:8000/docs`.

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
- Sistema de autenticación JWT (admin + guest)
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
- Email: tu.email@example.com
