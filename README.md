# AlgoAnalyze AI

AlgoAnalyze AI is a full-stack TypeScript project scaffold with a React/Vite client and an Express API server.

## Tech Stack

- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express, TypeScript
- Styling: Tailwind CSS
- Routing: React Router
- Code editor: Monaco Editor
- Animations: Framer Motion
- Planned integrations: Neon PostgreSQL, Prisma, JWT auth, and Gemini API

## Project Structure

```text
algoanalyze-ai/
  client/
  server/
  README.md
  .gitignore
```

## Setup

Install dependencies for each app:

```bash
cd client
npm install

cd ../server
npm install
```

Create environment files:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### Client Environment

Create `client/.env`:

```bash
cp client/.env.example client/.env
```

Expected client variable:

```env
VITE_API_BASE_URL=http://localhost:5050
```

Only `VITE_` variables are exposed to the browser. Do not add Gemini or JWT secrets to the client environment.

### Server Environment

Create `server/.env`:

```bash
cp server/.env.example server/.env
```

Expected server variables:

```env
PORT=5050
CLIENT_URL=http://localhost:5173

DATABASE_URL=

JWT_SECRET=
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=
```

`DATABASE_URL` and `JWT_SECRET` are required. The API will fail at startup with a clear error if either value is missing.

`GEMINI_API_KEY` is optional for now. If it is missing, the server still starts and future AI routes should return mock responses.

`JWT_EXPIRES_IN` controls token lifetime and defaults to `7d`.

### Neon DATABASE_URL

1. Create a Neon project at `https://neon.tech`.
2. Open the project dashboard.
3. Go to the connection details for your database.
4. Select the Node.js or Prisma connection string.
5. Copy the PostgreSQL connection string into `server/.env` as `DATABASE_URL`.

Example format:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

For Neon pooled connections, the URL may include the pooler host and extra parameters:

```env
DATABASE_URL=postgresql://user:password@ep-example-pooler.region.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Keep `DATABASE_URL` in `server/.env` only.

### Prisma Setup

Prisma is configured in `server/prisma/schema.prisma` with PostgreSQL as the datasource:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

The backend exports a singleton Prisma Client from `server/src/lib/prisma.ts`.

Generate Prisma Client:

```bash
cd server
npm run prisma:generate
```

Create and apply a development migration:

```bash
cd server
npm run prisma:migrate -- --name init
```

Push schema changes without creating a migration:

```bash
cd server
npm run prisma:push
```

Open Prisma Studio:

```bash
cd server
npm run prisma:studio
```

### Gemini API Key

1. Open Google AI Studio at `https://aistudio.google.com`.
2. Create or select an API key.
3. Add it only to `server/.env` as `GEMINI_API_KEY`.

Never create `VITE_GEMINI_API_KEY`; Gemini requests must go through the Node.js backend.

Run the client:

```bash
cd client
npm run dev
```

Run the server:

```bash
cd server
npm run dev
```

The client defaults to `http://localhost:5173`.
The server defaults to `http://localhost:5050`.

## Health Check

```bash
curl http://localhost:5050/health
```

## JWT Authentication

Authentication uses Prisma, Neon PostgreSQL, bcrypt password hashing, and stateless JWT tokens.

Auth routes:

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Signup body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "password123"
}
```

Login body:

```json
{
  "email": "ada@example.com",
  "password": "password123"
}
```

Successful signup and login responses include:

```json
{
  "user": {
    "id": "user-id",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "token": "jwt-token"
}
```

Protected requests must include the token:

```bash
curl http://localhost:5050/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Logout is stateless:

```bash
curl -X POST http://localhost:5050/api/auth/logout
```

The frontend stores the JWT in `localStorage` using the key `algoanalyze_token`. On app load, it reads the token and calls `GET /api/auth/me`. If the token is invalid or expired, the frontend removes it and redirects protected pages to login.

Protected frontend pages:

- `/dashboard`
- `/history`
- `/saved-problems/:problemId`
- `/settings`

## Code Analysis API

The dashboard calls the backend-only Gemini integration through a protected route:

```text
POST /api/analyze-code
```

Request body:

```json
{
  "title": "Two Sum",
  "problemStatement": "Given an array of integers...",
  "code": "class Solution:\\n    def solve(self):\\n        pass",
  "sampleInput": "nums=[2,7,11,15], target=9",
  "expectedOutput": "[0,1]",
  "languageMode": "english"
}
```

The request must include:

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

Gemini runs only in the Node.js backend using `GEMINI_API_KEY`. If the key is missing, Gemini is unavailable, or Gemini returns invalid JSON, the backend returns a safe fallback analysis response instead of crashing.

## Security Notes

- Do not commit `.env` files.
- Do not expose the Gemini API key in frontend code or any `VITE_` variable.
- Do not expose `JWT_SECRET` in frontend code, logs, or client-visible responses.
- Keep `DATABASE_URL`, `JWT_SECRET`, and `GEMINI_API_KEY` backend-only.
- Never return `passwordHash` from API responses.

Prisma is configured for Neon PostgreSQL and JWT auth routes are available. Gemini routes are intentionally not integrated yet.
