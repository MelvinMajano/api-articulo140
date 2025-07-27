CREATE DATABASE IF NOT EXISTS articulo140;
USE articulo140;

CREATE TABLE carrera (
    id INT,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

ALTER TABLE carrera
ADD CONSTRAINT pk_carrera PRIMARY KEY (id);

INSERT INTO carrera (id, nombre) VALUES
(1, 'Ingenieria en Sistemas');

CREATE TABLE rol (
    id INT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE rol
ADD CONSTRAINT pk_rol PRIMARY KEY (id);

INSERT INTO rol (id, nombre) VALUES
(1, 'Administrador'),
(2, 'Estudiante'),
(3, 'Supervisor');

CREATE TABLE estado (
    id INT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE estado
ADD CONSTRAINT pk_estado PRIMARY KEY (id);

INSERT INTO estado (id, nombre) VALUES
(1, 'pendiente'),
(2, 'en_curso'),
(3, 'finalizada'),
(4, 'deshabilitada');

CREATE TABLE users (
    id CHAR(36) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    numero_cuenta BIGINT,
    numero_identidad  VARCHAR(20),
    rol_id INT NOT NULL,
    carrera_id INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT pk_users PRIMARY KEY (id);

ALTER TABLE users
ADD CONSTRAINT fk_users_rol FOREIGN KEY (rol_id) REFERENCES rol(id);

ALTER TABLE users
ADD CONSTRAINT fk_users_carrera FOREIGN KEY (carrera_id) REFERENCES carrera(id);

ALTER TABLE users
ADD CONSTRAINT uq_email UNIQUE (email);

ALTER TABLE users
ADD CONSTRAINT uq_numero_cuenta UNIQUE (numero_cuenta);

ALTER TABLE users
ADD CONSTRAINT uq_numero_identidad UNIQUE (numero_identidad);

CREATE TABLE ambito (
    id INT,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

ALTER TABLE ambito
ADD CONSTRAINT pk_ambito PRIMARY KEY (id);

INSERT INTO ambito (id, nombre) VALUES
(1, 'Cultural'),
(2, 'Científico-Académico'),
(3, 'Deportivo'),
(4, 'Social');

CREATE TABLE actividad (
    id CHAR(36) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    carrera_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    horasVoae INT NOT NULL,
    cupos_disponibles INT NOT NULL,
    supervisor_id CHAR(36) NOT NULL,
    estado_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE actividad
ADD CONSTRAINT pk_actividad PRIMARY KEY (id);

ALTER TABLE actividad
ADD CONSTRAINT fk_actividad_supervisor FOREIGN KEY (supervisor_id) REFERENCES users(id);

ALTER TABLE actividad
ADD CONSTRAINT fk_actividad_estado FOREIGN KEY (estado_id) REFERENCES estado(id);

ALTER TABLE actividad
ADD CONSTRAINT fk_actividad_carrera FOREIGN KEY (carrera_id) REFERENCES carrera(id);

CREATE TABLE actividad_ambito (
    actividad_id CHAR(36) NOT NULL,
    ambito_id INT NOT NULL
);

ALTER TABLE actividad_ambito
ADD CONSTRAINT pk_actividad_ambito PRIMARY KEY (actividad_id, ambito_id);

ALTER TABLE actividad_ambito
ADD CONSTRAINT fk_actividad_ambito_actividad FOREIGN KEY (actividad_id) REFERENCES actividad(id);

ALTER TABLE actividad_ambito
ADD CONSTRAINT fk_actividad_ambito_ambito FOREIGN KEY (ambito_id) REFERENCES ambito(id);

CREATE TABLE estado_registro (
    id INT,
    nombre VARCHAR(50) NOT NULL
);

ALTER TABLE estado_registro
ADD CONSTRAINT pk_estado_registro PRIMARY KEY (id);

ALTER TABLE estado_registro
ADD CONSTRAINT uq_estado_registro_nombre UNIQUE (nombre);

INSERT INTO estado_registro (id, nombre) VALUES
(1, 'abierto'),
(2, 'cerrado');

CREATE TABLE registro (
    id CHAR(36) NOT NULL,
    actividad_id CHAR(36) NOT NULL,
    estudiante_id CHAR(36) NOT NULL,
    estado_registro_id INT NOT NULL DEFAULT 1,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE registro
ADD CONSTRAINT pk_registro PRIMARY KEY (id);

ALTER TABLE registro
ADD CONSTRAINT fk_registro_actividad FOREIGN KEY (actividad_id) REFERENCES actividad(id);

ALTER TABLE registro
ADD CONSTRAINT fk_registro_estudiante FOREIGN KEY (estudiante_id) REFERENCES users(id);

ALTER TABLE registro
ADD CONSTRAINT fk_registro_estado FOREIGN KEY (estado_registro_id) REFERENCES estado_registro(id);

ALTER TABLE registro
ADD CONSTRAINT uq_registro_actividad_estudiante UNIQUE (actividad_id, estudiante_id);

CREATE TABLE asistencia (
    id CHAR(36) NOT NULL,
    registro_id CHAR(36) NOT NULL,
    hora_entrada DATETIME NOT NULL,
    hora_salida DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE asistencia
ADD CONSTRAINT pk_asistencia PRIMARY KEY (id);

ALTER TABLE asistencia
ADD CONSTRAINT fk_asistencia_registro FOREIGN KEY (registro_id) REFERENCES registro(id);


CREATE TABLE archivos (
    id CHAR(36) NOT NULL,
    actividad_id CHAR(36) NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE archivos
ADD CONSTRAINT pk_archivos PRIMARY KEY (id);

ALTER TABLE archivos
ADD CONSTRAINT fk_archivos_actividad FOREIGN KEY (actividad_id) REFERENCES actividad(id);
