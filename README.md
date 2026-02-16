# 🏨 LuxeHotel - Sistema de Gestión Hotelera

<div align="center">

![LuxeHotel Banner](URL_DE_UNA_IMAGEN_PRINCIPAL)

**Sistema completo de gestión hotelera con reservas en tiempo real, sistema de reviews y pagos integrados**

[Demo en vivo](https://tu-deploy.com) • [Documentación API](https://tu-api.com/docs) • [Reporte de Bug](https://github.com/tu-usuario/luxehotel/issues)

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://www.docker.com/)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Variables de Entorno](#-variables-de-entorno)
- [API Documentation](#-api-documentation)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Contacto](#-contacto)

---

## ✨ Características

### 🎯 Funcionalidades Principales

- **Sistema de Reservas Inteligente**
  - Búsqueda y filtrado avanzado de habitaciones
  - Cálculo automático de precios con impuestos y tarifas
  - Validación de disponibilidad en tiempo real
  - Reservas para usuarios invitados (sin registro)

- **Gestión de Habitaciones**
  - 9 tipos diferentes de habitaciones
  - Sistema de amenidades personalizables
  - Galería de imágenes con Cloudinary CDN
  - Control de inventario y disponibilidad

- **Sistema de Reviews & Ratings**
  - Reviews verificados (solo huéspedes con reserva confirmada)
  - Calificaciones desglosadas (limpieza, confort, ubicación, staff, precio)
  - Actualización automática de ratings con triggers de PostgreSQL
  - Categorización por tipo de viajero (Solo, Pareja, Familia, Negocios)

- **Autenticación & Autorización**
  - JWT authentication
  - Roles de usuario (Admin, Guest)
  - Rutas protegidas

- **Panel de Administración** *(próximamente)*
  - Dashboard con métricas en tiempo real
  - Gestión de reservas y huéspedes
  - Reportes y analytics

### 🚀 Características Técnicas

- **API RESTful** con FastAPI y documentación automática (Swagger)
- **Triggers automáticos** en PostgreSQL para actualización de ratings
- **Paginación** en todos los endpoints
- **Validación robusta** con Pydantic schemas
- **Dockerizado** para fácil deployment
- **Responsive Design** - Mobile first
- **CDN** con Cloudinary para optimización de imágenes

---

## 🎬 Demo

### Video Demo
[![Video Demo](https://img.youtube.com/vi/TU_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=TU_VIDEO_ID)

### Screenshots en vivo
- **Producción:** [https://luxehotel-demo.vercel.app](URL)
- **API Docs:** [https://api.luxehotel.com/docs](URL)

---

## 🛠 Tech Stack

### Frontend
```
React 18.2         - UI Library
React Router 6     - Navegación
Context API        - State Management
TailwindCSS        - Estilos
Lucide React       - Iconos
Axios              - HTTP Client
```

### Backend
```
FastAPI 0.104      - Framework web
SQLAlchemy 2.0     - ORM
Pydantic           - Validación de datos
Alembic            - Migraciones de BD
JWT                - Autenticación
```

### Base de Datos
```
PostgreSQL 17      - Base de datos principal
Redis              - Cache (próximamente)
```

### Infraestructura & DevOps
```
Docker             - Containerización
Docker Compose     - Orquestación local
Cloudinary         - CDN & Gestión de imágenes
GitHub Actions     - CI/CD (próximamente)
```

---

## 🏗 Arquitectura
```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    React     │  │   Context    │  │  TailwindCSS │      │
│  │   Router     │  │     API      │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (FastAPI)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Endpoints   │  │    Auth      │  │  Validation  │      │
│  │              │  │     JWT      │  │  (Pydantic)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ SQLAlchemy ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Rooms     │  │ Reservations │  │   Reviews    │      │
│  │    Guests    │  │   Payments   │  │    Users     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    + Triggers automáticos                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              CLOUDINARY CDN (Imágenes)                      │
└─────────────────────────────────────────────────────────────┘
```

### Modelo de Base de Datos
```sql
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│    users    │       │    guests    │       │    rooms    │
├─────────────┤       ├──────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)      │       │ id (PK)     │
│ email       │       │ first_name   │       │ name        │
│ password    │       │ last_name    │       │ price       │
│ role        │       │ email        │       │ rating ⭐   │
└─────────────┘       │ phone        │       │ total_rev ⭐│
                      └──────┬───────┘       └──────┬──────┘
                             │                      │
                             │   ┌──────────────────┘
                             │   │
                      ┌──────▼───▼──────┐
                      │  reservations   │
                      ├─────────────────┤
                      │ id (PK)         │
                      │ guest_id (FK)   │
                      │ room_id (FK)    │
                      │ check_in_date   │
                      │ check_out_date  │
                      │ total_amount    │
                      │ status          │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │    reviews      │
                      ├─────────────────┤
                      │ id (PK)         │
                      │ room_id (FK)    │
                      │ guest_id (FK)   │
                      │ rating_overall  │
                      │ comment         │
                      │ verified        │
                      └─────────────────┘

⭐ = Actualizado automáticamente por triggers
```

---

## 🚀 Instalación

### Prerrequisitos
```bash
- Docker & Docker Compose
- Node.js 18+
- Python 3.12+
- Git
```

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/luxehotel.git
cd luxehotel
```

### 2. Configurar variables de entorno

#### Backend (.env en /Backend)
```bash
cp .env.example .env
```
```env
# Database
DATABASE_URL=postgresql://luxe_user:luxe_password@luxehotel_db:5432/luxeHotel

# JWT
SECRET_KEY=tu-secret-key-super-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
```

#### Frontend (.env en /Frontend)
```bash
cp .env.example .env
```
```env
VITE_API_URL=http://localhost:8000
```

### 3. Levantar con Docker
```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto levantará:
- ✅ PostgreSQL en `localhost:5433`
- ✅ Backend API en `http://localhost:8000`
- ✅ Documentación API en `http://localhost:8000/docs`

### 4. Instalar y correr el Frontend
```bash
cd Frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`

### 5. Cargar datos de ejemplo (Opcional)
```bash
docker exec -it luxehotel_backend bash
python scripts/seed_data.py
```

---

## 🔐 Variables de Entorno

### Backend (.env)

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `DATABASE_URL` | URL de conexión PostgreSQL | ✅ | - |
| `SECRET_KEY` | Llave secreta para JWT | ✅ | - |
| `ALGORITHM` | Algoritmo de encriptación | ❌ | HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración del token | ❌ | 30 |
| `CLOUDINARY_CLOUD_NAME` | Nombre de cloud Cloudinary | ✅ | - |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | ✅ | - |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | ✅ | - |

### Frontend (.env)

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `VITE_API_URL` | URL del backend | ✅ | http://localhost:8000 |

---

## 📚 API Documentation

### Endpoints Principales

#### 🏠 Rooms
```http
GET /rooms
```
Lista todas las habitaciones con filtros y paginación

**Query Parameters:**
- `page` (int): Número de página (default: 1)
- `limit` (int): Items por página (default: 20)
- `min_price` (float): Precio mínimo
- `max_price` (float): Precio máximo
- `max_guests` (int): Capacidad mínima de huéspedes
- `view_type` (string): Tipo de vista (Garden, City, Panoramic)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Double Elegance",
      "price_per_night": 220.00,
      "rating": 4.8,
      "total_reviews": 5,
      "size_m2": 40,
      "view_type": "Garden",
      "amenities": ["balcony", "minibar", "smart_tv"]
    }
  ],
  "total": 9,
  "page": 1,
  "limit": 20
}
```

---
```http
GET /rooms/{room_id}/reviews
```
Obtiene reviews de una habitación específica

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "rating_overall": 4.8,
      "comment_title": "Excelente habitación",
      "comment_text": "La habitación estaba impecable...",
      "guest_name": "Alexander H.",
      "stay_date": "2025-01-15",
      "traveler_type": "Couple"
    }
  ],
  "total": 5
}
```

---

#### 📅 Reservations
```http
POST /guest-booking
```
Crear una reserva (sin autenticación requerida)

**Request Body:**
```json
{
  "room_id": "uuid",
  "check_in_date": "2026-03-01",
  "check_out_date": "2026-03-05",
  "adults": 2,
  "children": 0,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "special_requests": "Late check-in please"
}
```

**Response:**
```json
{
  "reservation_id": "uuid",
  "reference_number": "LX-ABC12345",
  "total_amount": 1200.00,
  "status": "pending",
  "message": "Reservation created successfully!"
}
```

---

#### 🔐 Authentication
```http
POST /login
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Documentación interactiva

Visita `http://localhost:8000/docs` para acceder a la documentación completa de Swagger UI.

---

## 📸 Capturas de Pantalla

### Página Principal
![Home](screenshots/home.png)

### Comparación de Habitaciones
![Compare Rooms](screenshots/compare-rooms.png)

### Sistema de Reviews
![Reviews Modal](screenshots/reviews-modal.png)

### Proceso de Reserva
![Reservation Flow](screenshots/reservation.png)

---

## 🗺 Roadmap

### ✅ Completado
- [x] Sistema de autenticación JWT
- [x] CRUD de habitaciones
- [x] Sistema de reservas
- [x] Reviews y ratings
- [x] Integración con Cloudinary
- [x] Responsive design
- [x] Docker setup

### 🚧 En Progreso
- [ ] Panel de administración
- [ ] Dashboard con métricas
- [ ] Sistema de notificaciones por email

### 📋 Planeado
- [ ] Integración con Stripe/PayPal
- [ ] Chat en vivo con soporte
- [ ] Sistema de descuentos y promociones
- [ ] Multi-idioma (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Integración con Google Calendar
- [ ] Sistema de fidelización de clientes
- [ ] Tests automatizados (Jest, Pytest)
- [ ] CI/CD con GitHub Actions

---

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Nombre](https://linkedin.com/in/tu-perfil)
- Email: tu.email@example.com
- Portfolio: [tuportfolio.com](https://tuportfolio.com)

---

## 🙏 Agradecimientos

- [FastAPI](https://fastapi.tiangolo.com/) - Framework web increíble
- [React](https://reactjs.org/) - Biblioteca UI
- [Cloudinary](https://cloudinary.com/) - Gestión de imágenes
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS

---

<div align="center">

**⭐ Si te gustó este proyecto, dale una estrella en GitHub! ⭐**

[⬆ Volver arriba](#-luxehotel---sistema-de-gestión-hotelera)

</div>

