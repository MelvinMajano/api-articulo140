# Recursos de la API y Endpoints

##  Auth (Autenticación y Autorización)

- POST   `/api/auth/register`             → Registrar usuario  
- POST   `/api/auth/login`                → Login de usuario  
- PUT    `/api/auth/password/:id`         → Cambiar contraseña  
- PUT    `/api/auth/data/:id`             → Actualizar datos del usuario  
- DELETE `/api/auth/register/:id`         → Eliminar usuario  

---

##  Users (Usuarios)

- GET    `/api/users/:id/activities`                        → Ver actividades en las que participó el usuario  
- GET    `/api/users/:id/fields/:fieldid`                  → Ver horas vinculadas en un campo específico   

---

##  Activities (Actividades)

### Actividades 

- GET    `/api/activities`                         → Ver todas las actividades  
- GET    `/api/activities/:id`                     → Ver actividad específica  
- POST   `/api/activities`                         → Crear nueva actividad  
- PUT    `/api/activities/:id`                     → Actualizar actividad  
- DELETE `/api/activities/:id`                     → Eliminar (lógicamente) actividad  

### Asistencias
- POST   `/api/activities/:id/attendance`           → Registrar asistencias
- GET    `/api/activities/:id/attendance`           → Ver asistencias de la actividad  
- PUT    `/api/activities/:id/attendance/:userId`   → Actualizar asistencia específica

### Logica para la siguiente version 
- GET    `/api/activities/:id/files`               → Ver archivos de la actividad (2da etapa)  
- POST   `/api/activities/:id/files`               → Asignar archivo a actividad (2da etapa)  
- DELETE `/api/activities/files/:id`               → Eliminar archivo de actividad (2da etapa)  

### Inscripciones
- POST   `/api/activities/register/:id`            → Registrarse en una actividad  
- PUT    `/api/activities/register/end/:id`        → Cerrar inscripciones  
- PUT    `/api/activities/finish/:id`              → Marcar actividad como finalizada  
- DELETE `/api/activities/register/:id`            → Desinscribirse de actividad  
---
