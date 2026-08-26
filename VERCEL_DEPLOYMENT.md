# 🚀 Deploying Smart Bus Transit System to Vercel

This guide provides step-by-step instructions for deploying your Smart Bus Transit project to **Vercel**.

---

## 🌟 Quick Overview

The repository is pre-configured with:
- **`vercel.json`**: Directs build commands, serves the React + Vite frontend, and routes `/api/*` to the serverless API function.
- **`api/index.js`**: Serverless Express function exposing all backend endpoints (`/api/buses`, `/api/routes`, `/api/tickets`, `/api/alerts`, `/api/analytics`, `/api/driver`, `/api/health`).
- **Real-Time Dynamic Simulation**: Client-side GPS interpolation and automatic REST polling ensure that buses, ETAs, speeds, and passenger telemetry move live on screen even in serverless environments.

---

## Option 1: Deploy with Git / GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel serverless deployment"
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard).
   - Click **"Add New..."** ➔ **"Project"**.
   - Select your GitHub repository (`smart-bus`).

3. **Configure Project Settings in Vercel**:
   - **Framework Preset**: Vite (or Other)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `cd frontend && npm install && npm run build` *(Pre-configured in `vercel.json`)*
   - **Output Directory**: `frontend/dist` *(Pre-configured in `vercel.json`)*

4. **Deploy**:
   - Click **"Deploy"**.
   - Within ~60 seconds, your site will be live at `https://your-project.vercel.app`!

---

## Option 2: Deploy using Vercel CLI

If you have the Vercel CLI installed:

```bash
# 1. Login to Vercel (if not already logged in)
npx vercel login

# 2. Deploy to preview
npx vercel

# 3. Deploy to production
npx vercel --prod
```

---

## ⚡ Optional: Connecting a Dedicated Persistent WebSocket Backend

If you want persistent multi-user Socket.io broadcasts (e.g. driver console updating all passenger screens instantly via WebSockets) across multiple devices, you can host the `backend/` folder on **Railway**, **Render**, or **Heroku**:

1. Deploy `backend/` to Railway/Render (using `npm start` / `node server.js`).
2. Copy your backend live URL (e.g. `https://smart-bus-backend.onrender.com`).
3. In your Vercel Project Dashboard ➔ **Settings** ➔ **Environment Variables**, add:
   - `VITE_API_URL` = `https://smart-bus-backend.onrender.com`
   - `VITE_SOCKET_URL` = `https://smart-bus-backend.onrender.com`
4. Redeploy in Vercel. The frontend will automatically connect to your persistent WebSocket backend!

---

## 🧪 Testing Your Deployment Locally

To test the production build locally before deploying:

```bash
# Build frontend
npm run build

# Start backend server
npm start
```
