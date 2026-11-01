# Apex Coaching Management System

A full-stack academic project built with React, Tailwind CSS v4, Express 5 and Oracle Database.

## Requirements
- Node.js 22.12+ (Node 22 LTS recommended)
- An existing Oracle Database instance with a PDB/service accessible over TCP (default service in `.env.example`: `FREEPDB1`)
- SQL Developer or another Oracle SQL client

## 1. Configure Oracle without replacing your existing database

This project does **not** install, remove, reset, or modify an Oracle database instance. It creates a separate schema named `APEX_CMS_APP` inside the PDB you select.

1. Open SQL Developer and connect as an account allowed to create users (normally `SYSTEM`).
2. Connect to the intended PDB/service, not the CDB root. Confirm it with:
   ```sql
   SELECT SYS_CONTEXT('USERENV', 'CON_NAME') AS CONTAINER_NAME FROM DUAL;
   SELECT name, open_mode FROM v$pdbs;
   ```
   If you do not have permission to query `V$PDBS`, use the service name shown in your existing Oracle connection.
3. Run `database/01_create_app_user.sql` while connected to the intended PDB as `SYSTEM`.
4. Create a SQL Developer connection using:
   - Username: `APEX_CMS_APP`
   - Password: the password you set in the user-creation script
   - Host: `localhost`
   - Port: `1521` (unless your listener uses another port)
   - Service name: your existing PDB service
5. Connect as `APEX_CMS_APP` and run `database/02_create_tables.sql`.

**Password note:** The supplied six-digit password `109310` may be rejected by your Oracle profile's password policy. If so, set a stronger password in `01_create_app_user.sql` and use exactly the same value in `backend/.env`. Do not weaken the Oracle profile policy just for this project.

Do not run `DROP USER`, `DROP DATABASE`, `DROP PLUGGABLE DATABASE`, or reinstall Oracle. If `APEX_CMS_APP` already exists, stop and inspect it rather than dropping it.

## 2. Install dependencies

From this project root:

```bash
npm install
```

## 3. Configure backend

Copy `backend/.env.example` to `backend/.env`, then set the host, port, service name, username, password and JWT secret to match your existing Oracle installation.

On Windows CMD:
```bat
copy backend\.env.example backend\.env
```

On PowerShell:
```powershell
Copy-Item backend/.env.example backend/.env
```

## 4. Start

```bash
npm run dev
```

Open http://localhost:5173

Default local demo admin:
- Email: `admin@apexcoaching.com`
- Password: `Admin@12345`

The backend creates this admin on startup if it does not already exist. The password is stored as a bcrypt hash. Change it after your first login.

## Available modules
Dashboard, students, teachers, courses, batches, enrollments, payments, attendance, reports, admin profile and password change.

## Notes
- This is an academic/local demonstration project, not a production deployment.
- The backend uses Oracle's node-oracledb Thin mode; a separate Oracle Instant Client is not required for supported database versions.
- Do not expose the backend publicly with the demo JWT secret or demo admin credentials.
- Database setup scripts are intentionally non-destructive. They create new objects and do not drop existing schemas or tables.
