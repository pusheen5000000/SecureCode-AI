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


---

# Backend Setup

Go to the backend folder:

cd backend

Install dependencies:

npm install


Create a `.env` file:

OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.6
PORT=3001


Run backend:

npm run dev


Backend runs at:

http://localhost:3001


---

# Required Packages

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React


Backend:
- Node.js
- Express
- TypeScript
- OpenAI SDK
- dotenv
- CORS
- Helmet
- Zod


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


Start both frontend and backend servers.