# Local Development Setup

## How to Run Locally

### Terminal 1: Start Backend
```bash
cd Backend
npm run dev
```

You should see:
```
✅ Connected to Database successfully
✅ Server is running on port 3000
```

### Terminal 2: Start Frontend
```bash
cd Frontend
npm run dev
```

You should see:
```
➜  Local: http://localhost:5173/
```

### Open in Browser
Go to: `http://localhost:5173/`

---

## What Changed for Local Dev

The `.env` file has been updated to use the local backend:

```
# Frontend/.env (BEFORE - for production)
VITE_API_URL=https://prepgenius-ai-wgok.onrender.com

# Frontend/.env (AFTER - for local dev)
VITE_API_URL=http://localhost:3000
```

### Environment Files Explained

**For Local Development** (`Frontend/.env`):
```
VITE_API_URL=http://localhost:3000
```

**For Production** (Vercel/Render):
```
VITE_API_URL=https://prepgenius-ai-wgok.onrender.com
```

---

## Troubleshooting Local Issues

### ❌ Error: "Failed to load resource: the server responded with a status of 401"
- **Cause**: Frontend trying to reach production backend instead of local
- **Fix**: Make sure `Frontend/.env` has `VITE_API_URL=http://localhost:3000`
- **Check**: After changing .env, restart the frontend dev server (Ctrl+C, then `npm run dev`)

### ❌ Error: "CORS policy blocked"
- **Cause**: Backend CORS not allowing localStorage:5173
- **Fix**: Already added to [Backend/src/app.js](Backend/src/app.js)
- **Verify**: Backend CORS includes `http://localhost:5173`

### ❌ Error: "Cannot GET /api/auth/get-me"
- **Cause**: Backend not running
- **Fix**: Make sure Terminal 1 shows `Server is running on port 3000`

### ❌ Error: "ECONNREFUSED 127.0.0.1:3000"
- **Cause**: Backend is not running
- **Fix**: Start backend with `npm run dev` in Backend folder

---

## Testing Checklist

- [ ] Backend is running on port 3000
- [ ] Frontend is running on port 5173
- [ ] Frontend .env has `VITE_API_URL=http://localhost:3000`
- [ ] Can load login page at http://localhost:5173/login
- [ ] Can register a new account
- [ ] Can login with registered account
- [ ] Can access home page after login
- [ ] Can upload resume without errors

---

## For Production Deployment

When ready to deploy:

1. **Change Frontend .env back to production:**
   ```
   VITE_API_URL=https://prepgenius-ai-wgok.onrender.com
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "chore: update env for production"
   git push
   ```

3. **Deploy:**
   - Backend auto-deploys on Render
   - Frontend auto-deploys on Vercel

