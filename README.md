# 🐾 Sistema de Gestión Veterinaria

Proyecto en desarrollo para la gestión integral de una clínica veterinaria.  
Desarrollado con **Angular** (frontend) y **.NET Core** (backend), incluye login con control de roles (**Admin**, **Recepcionista**, **Veterinario**).

---

## 🎯 Funcionalidades principales

- Inicio de sesión (login)
- Cambio de contraseña
- Registro y gestión de clientes y mascotas
- Agenda de turnos
- Historial clínico
- Control de acceso por tipo de usuario (Admin, Recepcionista, Veterinario)
- Diseño responsive

---

## 🖼️ Capturas

### 🏠 Vista Home – Cambio de mascotas por cliente

<img src="./frontend/src/assets/capturas/home.gif" width="600"/>

### 🧑‍💼 Vista Admin

<img src="./frontend/src/assets/capturas/admin.gif" width="600"/>

### 📋 Vista Recepcionista

<img src="./frontend/src/assets/capturas/recepcionista.gif" width="600"/>

### 🩺 Vista Veterinario

<img src="./frontend/src/assets/capturas/veterinario.gif" width="600"/>

---

## 📋 Autorización – Permisos por rol

| Recurso / Acción            | Admin | Recepcionista | Veterinario |
| --------------------------- | :---: | :-----------: | :---------: |
| **🔐 Autenticación**        |       |               |             |
| Login                       |  ✅   |      ✅       |     ✅      |
| Registro de usuarios        |  ✅   |      🔒       |     🔒      |
| Dashboard (acceso)          |  ✅   |      ✅       |     ✅      |
| Obtener usuarios            |  ✅   |      🔒       |     🔒      |
| Editar usuarios             |  ✅   |      🔒       |     🔒      |
| Eliminar usuarios           |  ✅   |      🔒       |     🔒      |
| Cambiar contraseña          |  ✅   |      ✅       |     ✅      |
| **👥 Clientes**             |       |               |             |
| Obtener clientes            |  ✅   |      ✅       |     ✅      |
| Agregar cliente             |  ✅   |      ✅       |     🔒      |
| Editar cliente              |  ✅   |      ✅       |     🔒      |
| Eliminar cliente            |  ✅   |      🔒       |     🔒      |
| **📄 Historial Clínico**    |       |               |             |
| Ver historial clínico       |  ✅   |      ✅       |     ✅      |
| Crear historial clínico     |  ✅   |      🔒       |     ✅      |
| **📆 Turnos**               |       |               |             |
| Obtener turnos              |  ✅   |      ✅       |     ✅      |
| Crear turno                 |  ✅   |      ✅       |     🔒      |
| Editar turno                |  ✅   |      ✅       |     ✅      |
| Eliminar turno              |  ✅   |      🔒       |     🔒      |
| **🐾 Pacientes (Mascotas)** |       |               |             |
| Obtener pacientes           |  ✅   |      ✅       |     ✅      |
| Crear paciente              |  ✅   |      ✅       |     ✅      |
| Editar paciente             |  ✅   |      ✅       |     ✅      |
| Eliminar paciente           |  ✅   |      🔒       |     🔒      |

---

## 🧪 Demo

🔗 Video demostrativo con login y funcionalidades por rol:  
[https://youtu.be/tu-link](https://youtu.be/tu-link)

---

## 🛠️ Tecnologías

- Angular
- .NET Core
- Entity Framework
- PostgreSQL
