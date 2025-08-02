CREATE DATABASE IF NOT EXISTS articulo140;
USE articulo140;

CREATE TABLE degrees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    faculty VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO degrees (code, name, faculty) VALUES
('IS001', 'Ingenieria en Sistemas', 'Facultad de Ingenieria');


CREATE TABLE users (
    id CHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    accountNumber BIGINT,
    identityNumber VARCHAR(20),
    role ENUM('admin', 'student', 'supervisor') NOT NULL,
    degreeId INT NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD CONSTRAINT pk_users PRIMARY KEY (id);

ALTER TABLE users
ADD CONSTRAINT fk_users_degree FOREIGN KEY (degreeId) REFERENCES degrees(id);

ALTER TABLE users
ADD CONSTRAINT uq_email UNIQUE (email);

ALTER TABLE users
ADD CONSTRAINT uq_accountNumber UNIQUE (accountNumber);

ALTER TABLE users
ADD CONSTRAINT uq_identityNumber UNIQUE (identityNumber);

CREATE TABLE activities (
    id CHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    degreeId INT NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME,
    voaeHours INT NOT NULL,
    availableSpots INT NOT NULL,
    supervisorId CHAR(36) NOT NULL,
    status ENUM('pending', 'inProgress', 'finished', 'disabled') NOT NULL DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE activities
ADD CONSTRAINT pk_activities PRIMARY KEY (id);

ALTER TABLE activities
ADD CONSTRAINT fk_activities_supervisor FOREIGN KEY (supervisorId) REFERENCES users(id);

ALTER TABLE activities
ADD CONSTRAINT fk_activities_degree FOREIGN KEY (degreeId) REFERENCES degrees(id);

CREATE TABLE activityScopes (
    activityId CHAR(36) NOT NULL,
    scope ENUM('cultural', 'cientificoAcademico', 'deportivo', 'social') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE activityScopes
ADD CONSTRAINT pk_activityScopes PRIMARY KEY (activityId, scope);

ALTER TABLE activityScopes
ADD CONSTRAINT fk_activityScopes_activity FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE;

CREATE TABLE registrations (
    studentId CHAR(36) NOT NULL,
    activityId CHAR(36) NOT NULL,
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE registrations
ADD CONSTRAINT pk_registrations PRIMARY KEY (studentId, activityId);

ALTER TABLE registrations
ADD CONSTRAINT fk_registrations_activity FOREIGN KEY (activityId) REFERENCES activities(id);

ALTER TABLE registrations
ADD CONSTRAINT fk_registrations_student FOREIGN KEY (studentId) REFERENCES users(id);

CREATE TABLE attendances (
    id CHAR(36) NOT NULL,
    studentId CHAR(36) NOT NULL,
    activityId CHAR(36) NOT NULL,
    entryTime DATETIME NOT NULL,
    exitTime DATETIME,
    observations TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE attendances
ADD CONSTRAINT pk_attendances PRIMARY KEY (id);

ALTER TABLE attendances
ADD CONSTRAINT fk_attendances_registration FOREIGN KEY (studentId, activityId) REFERENCES registrations(studentId, activityId);

CREATE TABLE files (
    id CHAR(36) NOT NULL,
    activityId CHAR(36) NOT NULL,
    fileName VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    fileType VARCHAR(50),
    fileSize BIGINT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE files
ADD CONSTRAINT pk_files PRIMARY KEY (id);

ALTER TABLE files
ADD CONSTRAINT fk_files_activity FOREIGN KEY (activityId) REFERENCES activities(id);
