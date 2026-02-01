# MedGuard - Sistema de Gestión de Guardias Médicas (SaaS Multi-Tenant)

MedGuard es una plataforma MVP diseñada para la gestión eficiente de pacientes en guardias de clínicas y hospitales. Permite el control de flujo de pacientes desde el ingreso, pasando por la clasificación de riesgo (**Triage**), hasta el alta o derivación, todo bajo una arquitectura **Multi-Tenant** (una única instancia de base de datos sirviendo a múltiples clínicas de forma aislada).

## 🚀 Tecnologías Principales

- **Backend:** Java 17, Spring Boot 3.2, Spring Security, JPA/Hibernate, JWT.
- **Frontend:** React 18, Vite, Tailwind CSS, Axios, Lucide React.
- **Base de Datos:** H2 (para desarrollo rápido) / PostgreSQL (listo para prod).
- **Arquitectura:** Multi-tenancy basado en `tenant_id` con aislamiento a nivel de consulta (Hibernate Filters).

## ✨ Características Principales

- **Multi-Tenancy:** Aislamiento total de datos por Clínica.
- **Autenticación:** Seguridad basada en JWT con roles (Admin, Médico, Enfermero).
- **Gestión de Pacientes:** Búsqueda por DNI y registro rápido.
- **Módulo de Triage:** Clasificación de pacientes por niveles de prioridad (Rojo a Azul).
- **Tablero en Tiempo Real:** Visualización del estado actual de la guardia.
- **UI Moderna:** Interfaz limpia, responsiva y en español.

## 🛠️ Instalación y Uso

### Clonar el Proyecto
```bash
git clone <url-del-repositorio>
cd salud
```

### 1. Backend (Spring Boot)
1. Navega a la carpeta: `cd backend`
2. Compila el proyecto: `mvn clean package`
3. Corre la aplicación: `mvn spring-boot:run`
> [!NOTE]
> El backend corre en **http://localhost:8081**. La base de datos H2 está disponible en `/h2-console`.

### 2. Frontend (React + Vite)
1. Navega a la carpeta: `cd ../frontend`
2. Instala dependencias: `npm install`
3. Corre el modo desarrollo: `npm run dev`
> [!NOTE]
> El frontend corre en **http://localhost:3000**.

## 🔑 Credenciales de Acceso (Demo)

El sistema autogenera un usuario administrador al iniciar por primera vez:

- **ID de Clínica:** `CLINIC-A`
- **Email:** `admin@clinic.com`
- **Contraseña:** `password`

## 🏥 ¿Qué es el Triage?

El sistema utiliza niveles de clasificación para priorizar la atención:
- **Nivel 1 (Rojo):** Emergencia - Atención inmediata.
- **Nivel 2 (Naranja):** Muy Urgente.
- **Nivel 3 (Amarillo):** Urgente.
- **Nivel 4 (Verde):** Estándar.
- **Nivel 5 (Azul):** No Urgente.

---
© 2026 MedGuard - Desarrollo pragmático para salud.
