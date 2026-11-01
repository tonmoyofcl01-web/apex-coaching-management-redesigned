# Apex Coaching Management System — Start Here

## 1. Start and connect the database

1. Start your local **Oracle Database 23ai Free**.
2. Open **Oracle SQL Developer** and connect with these details:

   - Host: `localhost`
   - Port: `1521`
   - Service name: `FREEPDB1`
   - Username: `APEX_CMS_APP`
   - Password: `109310`

## 2. Start the complete project

1. Open a terminal in the project root folder:
   `apex-coaching-management-redesigned`
2. Run:

   ```bash
   npm run dev
   ```

This command starts both the frontend and backend. Keep the terminal open while using the application.

## 3. Open the application

**Frontend — complete application:** http://localhost:5173/

Backend API: http://localhost:5000/

Backend health check: http://localhost:5000/api/health

## Admin login

- Email: `admin@apexcoaching.com`
- Password: `Admin@12345`

## Backend `.env` configuration

The following is the current local backend configuration:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

ORACLE_USER=APEX_CMS_APP
ORACLE_PASSWORD=109310
ORACLE_CONNECT_STRING=localhost:1521/FREEPDB1

JWT_SECRET=apex_coaching_management_secret_2026_change_this
JWT_EXPIRES_IN=8h
```

**Important:** Keep this file and your credentials private. Do not upload `.env` or this guide containing passwords to a public GitHub repository. The credentials have been shared in this chat, so change the database password, admin password, and JWT secret before exposing the application or repository publicly.
