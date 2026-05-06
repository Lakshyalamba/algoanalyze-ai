# AlgoAnalyze AI

AI-powered DSA visualizer and tutor that turns Python DSA code into step-by-step visualizations, dry runs, short annotations, and Gemini-powered English/Hinglish explanations.

## Project Overview

AlgoAnalyze AI is a full-stack learning platform for students who want to understand how data structures and algorithms work internally. Learners can enter a DSA problem statement, write Python code, and receive structured analysis that explains the code, identifies the pattern, estimates complexity, and converts execution into visual steps.

The project is designed for beginners, interview-preparation students, and anyone learning DSA through code tracing. Instead of forcing learners to manually dry run every variable, pointer, stack frame, or table update, AlgoAnalyze AI presents the execution in a guided and visual format.

Gemini AI helps by converting code and problem context into beginner-friendly explanations, English/Hinglish summaries, approach breakdowns, bug warnings, edge cases, similar problems, quiz questions, and concise notes.

## Problem Statement

Students often struggle to understand how DSA code executes internally. Manual dry runs are useful, but they are hard to follow when the code involves recursion, nested loops, dynamic programming tables, trees, graphs, or pointer-like logic.

Beginners also need explanations that are simple, visual, and language-friendly. AlgoAnalyze AI solves this by combining visual execution, dry run tables, current-line highlighting, and Gemini-powered English/Hinglish explanations in one learning dashboard.

## Key Features

- Python DSA code editor
- Problem statement input
- Gemini-powered code analysis
- Gemini chatbot
- English/Hinglish explanation mode
- Step-by-step visualizer
- Array visualizer
- Stack visualizer
- Queue visualizer
- Linked list visualizer
- Tree visualizer
- Graph visualizer
- Recursion visualizer
- DP table visualizer
- Sorting visualizer
- Heap visualizer
- Variable tracker
- Current line highlighter
- Dry run table
- Pattern detection
- Difficulty detection
- Time and space complexity analysis
- Brute force, better, and optimized approach
- Bug finder
- Edge case generator
- Similar problem suggestions
- Quiz mode
- Notes generator
- Saved history
- Progress dashboard

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Monaco Editor
- Framer Motion

### Backend

- Node.js
- Express
- TypeScript
- JWT
- Zod
- Helmet
- Rate limiting

### Database

- Neon PostgreSQL
- Prisma ORM

### AI

- Gemini API

## Architecture

```text
User
  -> React Dashboard
  -> Express API
  -> Gemini API for analysis/chat
  -> Prisma ORM
  -> Neon PostgreSQL
```

- The frontend never accesses the Gemini API directly.
- The Gemini API key is stored only on the backend.
- JWT protects private routes and user-specific data.
- Prisma handles database access and schema management.

## Folder Structure

```text
algoanalyze-ai/
  client/
    src/
      components/
      pages/
      services/
      context/
      utils/
  server/
    src/
      controllers/
      routes/
      services/
      middleware/
      validators/
      prompts/
      lib/
      utils/
    prisma/
      schema.prisma
```

## Environment Variables

Create local environment files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

### Client `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Server `.env`

```env
PORT=5000
CLIENT_URL=http://localhost:5173
ALLOW_VERCEL_PREVIEWS=true
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
```

### Security Notes

- Never commit `.env` files.
- Never expose `GEMINI_API_KEY` in the frontend.
- Never use `VITE_GEMINI_API_KEY`.
- Keep `JWT_SECRET` private.
- Keep the Neon database URL private.

## Local Setup

### Clone Repository

```bash
git clone <repo-url>
cd algoanalyze-ai
```

### Install Client

```bash
cd client
npm install
```

### Install Server

```bash
cd ../server
npm install
```

### Setup Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Run Backend

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### Run Frontend

Open a second terminal:

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Neon PostgreSQL Setup

1. Create a Neon project at `https://neon.tech`.
2. Create or select a PostgreSQL database.
3. Copy the connection string from the Neon dashboard.
4. Add it to `server/.env` as `DATABASE_URL`.
5. Run the Prisma migration:

```bash
cd server
npx prisma migrate dev --name init
```

Example connection string format:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

## Gemini API Setup

1. Open Google AI Studio at `https://aistudio.google.com`.
2. Create a Gemini API key.
3. Add it to `server/.env` as `GEMINI_API_KEY`.
4. Keep the key server-side only.

All Gemini requests should go through the Express API. The React client should only call the backend.

## API Routes

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### AI

- `POST /api/analyze-code`
- `POST /api/chat`

### Saved Problems

- `POST /api/saved-problems`
- `GET /api/saved-problems`
- `GET /api/saved-problems/:id`
- `DELETE /api/saved-problems/:id`

### Stats

- `GET /api/stats/overview`

### Health

- `GET /health`

## Database Models

### User

- `id`
- `name`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`

### SavedProblem

- `id`
- `userId`
- `title`
- `problemStatement`
- `code`
- `sampleInput`
- `expectedOutput`
- `pattern`
- `difficulty`
- `timeComplexity`
- `spaceComplexity`
- `explanation`
- `visualizationSteps`
- `dryRunTable`
- `bugsOrWarnings`
- `edgeCases`
- `similarProblems`
- `quizQuestions`

## Gemini Response Schema

The main `POST /api/analyze-code` response includes:

- `problemSummary`
- `questionExplanation`
- `hinglishExplanation`
- `pattern`
- `difficulty`
- `timeComplexity`
- `spaceComplexity`
- `approaches`
- `steps`
- `dryRunTable`
- `bugsOrWarnings`
- `edgeCases`
- `similarProblems`
- `quizQuestions`

## Deployment Guide

### Frontend Deployment

Deploy the `client` app to Vercel or Netlify.

Set this environment variable in the frontend hosting dashboard:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

Common frontend commands:

```bash
npm install
npm run build
```

Use `client/dist` as the production output directory.

### Backend Deployment

Deploy the `server` app to Render or Railway.

Add these server environment variables:

```env
PORT=5000
CLIENT_URL=https://your-frontend-url.com
ALLOW_VERCEL_PREVIEWS=true
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=
```

Recommended build command:

```bash
npm install && npm run prisma:generate && npm run build
```

Recommended start command:

```bash
npm run start
```

### Production Database

Use the production Neon `DATABASE_URL` on the deployed backend.

Run migrations during deployment:

```bash
npx prisma migrate deploy
```

## Scripts

### Client

- `npm run dev` - start the Vite development server
- `npm run build` - type-check and build the production frontend
- `npm run preview` - preview the production build locally

### Server

- `npm run dev` - start the Express API in development mode
- `npm run build` - compile TypeScript to `dist`
- `npm run start` - run the compiled backend
- `npm run prisma:generate` - generate Prisma Client
- `npm run prisma:migrate` - create and apply a development migration
- `npm run prisma:studio` - open Prisma Studio
- `npm run prisma:push` - push schema changes without creating a migration

## Resume Highlights

This project demonstrates:

- Full-stack development with React and Node.js
- AI integration using Gemini API
- Secure backend API design
- JWT authentication
- PostgreSQL database design
- Prisma ORM
- DSA visualization logic
- Prompt engineering
- Error handling and production readiness
- User-focused learning experience

## Screenshots

Add project screenshots here:

- Landing Page
- Dashboard
- Visualizer
- Chatbot
- History
- Progress Dashboard

## Future Improvements

- Multi-language code support
- More accurate execution tracing
- Real sandboxed Python execution
- More advanced graph/tree animations
- Collaborative learning rooms
- More DSA topic templates

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow.
