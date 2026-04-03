# Meal Planner

Macro Planner is a full-stack app for creating meals, saving recipes, and building weekly planners.

## Stack

- Frontend: React + Vite
- Backend: Express + MongoDB
- Auth: JWT cookies + Firebase for Google sign-in

## Project Structure

- `client/` contains the Vite frontend
- `api/` contains the Express API

## Local Setup

### 1. Install dependencies

Install root dependencies for the API:

```bash
npm install
```

Install frontend dependencies:

```bash
cd client
npm install
```

### 2. Create environment files

Create a root `.env` file for the API:

```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
CLIENT_URL=http://localhost:5173
```

If you need more than one allowed frontend origin, use `CLIENT_URLS` as a comma-separated list.

Create a `client/.env` file for the frontend:

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### 3. Run the app

Start the API from the project root:

```bash
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

### 4. Open the app

Frontend: `http://localhost:5173`

## Deployment

This project is easiest to deploy as two parts:

- frontend on Vercel
- backend on a Node host such as Render, Railway, or another Express-compatible platform

### Backend deployment

Set these environment variables on the backend host:

```env
MONGO=your_production_mongodb_connection_string
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

Start command:

```bash
npm start
```

### Frontend deployment

Deploy the `client/` directory as the frontend app.

Set these environment variables on the frontend host:

```env
VITE_API_URL=https://your-api-domain.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

If you use Vercel, the existing `client/vercel.json` handles SPA rewrites for client-side routing.

## Notes

- In production, auth cookies use secure settings and cross-site cookie behavior.
- Make sure the deployed frontend URL is included in `CLIENT_URL` or `CLIENT_URLS` on the API.
- If Google sign-in is enabled, your Firebase project should also allow the deployed frontend domain.
