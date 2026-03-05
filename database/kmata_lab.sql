-- ===============================
-- kmata SQL Injection Lab
-- ===============================

-- Crear base de datos
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'kmata_lab_db')
BEGIN
    CREATE DATABASE kmata_lab_db;
END
GO

USE kmata_lab_db;
GO

-- Crear login si no existe
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'kmata')
BEGIN
    CREATE LOGIN kmata WITH PASSWORD = 'Km@ta123';
END
GO

-- Crear usuario en la base
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'kmata')
BEGIN
    CREATE USER kmata FOR LOGIN kmata;
END
GO

-- Dar permisos (para laboratorio)
ALTER ROLE db_owner ADD MEMBER kmata;
GO

-- Crear tabla
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'users')
BEGIN
    CREATE TABLE users (
        id INT PRIMARY KEY IDENTITY(1,1),
        username VARCHAR(50),
        password VARCHAR(50)
    );
END
GO

-- Insertar datos si tabla vacía
IF NOT EXISTS (SELECT * FROM users)
BEGIN
    INSERT INTO users (username, password) VALUES
    ('admin', 'admin123'),
    ('user1', '1234'),
    ('paola', 'password');
END
GO