## 🪧 Rutas a desarrollar

| Método | Endpoint           | Descripción                               |
|--------|--------------------|------------------------------------------|
| POST    | ` api/auth/register   `         | Permitira registrar usuarios.|
| POST    | ` api/auth/login`     | Permitira validar el inicio de sesion segun contraseña y correo. |
| PUT   | ` api/auth/password/:id   `         | Permitira el cambio de contraseña de un usuario en especifico.|
| PUT   | ` api/auth/data/:id   `         | Permitira el cambio de datos a los usuarios.|
| GET    | ` api/activities`     | Permitira ver todas las actividades disponibles. |
| GET    | ` api/activities/:id`         | Permitira ver informacion sobre una actividad en especifico.|
| GET  | `   api/users/:id/activities`     | Permitira ver todas las actividades en las que un usuario participo. |
| GET    | ` api/users/:id/fields/:fieldid`         | Permitira ver la cantidad de horas vinculadas en cierto ambito| 
| GET    | ` api/activities/:id/asistance/`         | Permitira ver la asistencia de una actividad en especifico.|
| GET    | ` api/activities/:id/files`         | Permitira ver los documentos de una actividad en especifico. //Segunda etapa| 
| POST    | ` api/activities`     | Permitira a los usuarios registrar una nueva actividad. |
| POST   | ` api/activities/:activityid/register/:id`         | Permite a los usuarios registrarse en una actividad en especifico| 
| POST    | ` api/activities/:id/files/`         | Permitira asignar un documento a una actividad en especifico. /Segunda etapa|  
| POST    | ` api/users/:id/activities/:id/asistence`         | Permitira registrar la asistencia de los usuarios registrados en una actividad|  
| PUT   | ` api/activities/:id`     | Permitira a los usuarios con roles de administrador actualizar datos de cierta actividad. |
| PUT   | ` api/activities/:id/asistence/:userId`     | Permitira a los supervisores cambiar datos de la asistencia de un usuario a la actividad. |
| PUT   | ` api/activities/register/end/:id`         | Permitira cerrar el periodo de inscripcion a una actividad en especifico| 
| PUT | ` api/activities/finish/:id`         | Permitira a los supervisores dar por terminada la asistencia en una actividad|
| DELETE    | ` api/activities/:id`     | Permitira a los usuarios con roles de administrador eliminar logicamente una actividad . |
| DELETE    | ` api/activities/files/:id`         | Permitira eliminar un documento a una actividad en especifico. /Segunda etapa|  
| DELETE    | ` api/activities/:activityid/unsubscribe/:id`         | Permitira desenscribirse de una actividad|  
| DELETE    | ` api/auth/register/:id`         | Permitira eliminar a un usuario|  



