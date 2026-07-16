# SecureCode AI - Requirements

## Required Software

### Node.js
Required to run the frontend and backend.
Download:
https://nodejs.org/
Check installation:
node -v
npm -v

### Git
Required to clone the repository.
Check installation:
git --version

---

# Frontend Setup

Go to the frontend folder:
cd frontend

Install dependencies:
npm install

Run frontend:
npm run dev

Frontend runs at:
http://localhost:5173

### Frontend notes / gotchas
- `src/index.tsx` was actually CSS content, not a component — it must be named `src/index.css` to match the import in `main.tsx`.
- In `index.css`, the Google Fonts `@import url(...)` must come BEFORE `@import "tailwindcss";` — all `@import` statements must precede other CSS rules once Tailwind expands its own import.
- Required root-level config files (not present in the initial teammate push, had to be created manually): `vite.config.ts`, `index.html`, `tsconfig.json`.
- `package.json` should have `"type": "module"` and a `"scripts"` block with `dev`, `build`, `preview` (using `vite`).

---

# Backend Setup

Go to the backend folder:
cd backend

Install dependencies:
npm install

Create a `.env` file in `backend/` (same folder as `.env.example`, NOT the project root):

PORT=3001
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.6

Get an API key from platform.openai.com -> API keys.

Run backend:
npm run dev

Backend runs at:
http://localhost:3001

### Backend notes / gotchas
- `.env` must actually contain values — an empty or missing `.env` throws `OpenAIError: The OPENAI_API_KEY environment variable is missing or empty`.
- `.env` must be gitignored. Confirm with: `cat .gitignore | grep -i env`. If missing, add `.env`, `node_modules/`, and `dist/` to `.gitignore`.
- Verify the backend is up: `curl http://localhost:3001/health` should return `{"status":"ok"}`.
- Test the real endpoint:
  curl -X POST http://localhost:3001/api/analyze -H "Content-Type: application/json" -d '{"language":"javascript","code":"eval(userInput)"}'

---

# Running Both Servers

Frontend and backend must run in SEPARATE terminal tabs/windows — each `npm run dev` is a long-running process that holds its terminal.

- Terminal 1: `cd frontend && npm run dev` (port 5173)
- Terminal 2: `cd backend && npm run dev` (port 3001)

NOTE: as of now, the frontend's scan button uses mock data (`mockResults.ts`) and is NOT yet wired to call the backend `/api/analyze` endpoint. This is a pending integration step.

---

# Troubleshooting

Lost the terminal running a server / need to force-stop it:
lsof -ti:3001 | xargs kill -9   # backend
lsof -ti:5173 | xargs kill -9   # frontend

Check what changed / what's in the repo:
git status
git log --oneline -10
find . -not -path '*/node_modules/*' -not -path '*/.git/*' | sort

---

# Required Packages

Frontend:
- React 19
- TypeScript 7
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Lucide React

Backend:
- Node.js
- Express
- TypeScript
- OpenAI SDK
- dotenv
- CORS

---

# First Time Setup

Clone the repository:
git clone <repository-url>

Go into the project:
cd SecureCode-AI

Install frontend packages:
cd frontend
npm install

Install backend packages:
cd ../backend
npm install

Create backend/.env (see Backend Setup above), then start both servers in separate terminals.