# 🐛 Debugging Production Issues

## Current Problem: 502 Bad Gateway + CORS Errors

When you login on `https://prep-genius-ai-kohl.vercel.app/login`, you're getting:
- ❌ 502 Bad Gateway from Render backend
- ❌ CORS errors
- ❌ 401 authentication errors

---

## 🔍 Troubleshooting Steps

### Step 1: Check Render Backend Logs

1. Go to: https://dashboard.render.com
2. Click **"PrepGenius-AI"** service
3. Click **"Logs"** tab
4. Look for:
   - `❌ Database connection failed` → Check MONGO_URI
   - `❌ ERROR:` → Check what error occurred
   - `✅ Server is running` → Backend is healthy

**If you see database error:**
- Verify `MONGO_URI` is correct in Render Environment tab
- Check if MongoDB Atlas cluster is accessible

### Step 2: Check Vercel Frontend Logs

1. Go to: https://vercel.com/dashboard
2. Click **PrepGenius-AI** project
3. Click **Deployments**
4. Check if latest deployment was successful
5. Click **Logs** to see any build errors

### Step 3: Verify Environment Variables on Render

1. Go to Render Dashboard → PrepGenius-AI service
2. Click **Settings** → scroll to **Environment**
3. Check these exist and are correct:

```
MONGO_URI=mongodb+srv://pranit:Br3xYgbAj1Vpmpu9@interview-ai-cluster.cnzgpxe.mongodb.net/
GOOGLE_GENAI_API_KEY=AIzaSyD6ENtUKDZgHvgQr64itXc8VRMpN2NnhFY
JWT_SECRET=2939832181455d3eacd608fa0a015548e7b18253c6aa587ac6df68554d94c8a9
NODE_ENV=production
```

⚠️ If any are missing or wrong → Click **Settings** → **Environment** → Add them

### Step 4: Test Backend Directly (No Frontend)

Open in browser or use curl:
```bash
https://prepgenius-ai-xogk.onrender.com/api/auth/get-me
```

**Expected Response:**
- ✅ 401 JSON: `{"message": "Token not provided"}`  (This is GOOD - means backend is working)
- ❌ 502 error = Backend crashed
- ❌ 404 error = Route doesn't exist

### Step 5: Force Redeploy on Render

1. Render Dashboard → PrepGenius-AI
2. Click **Manual Deploy** button
3. Wait for deployment to complete
4. Check logs again

---

## 🚀 Quick Fix Checklist

- [ ] Render Environment variables are set correctly
- [ ] MongoDB connection is working (no errors in logs)
- [ ] Latest code is deployed to both Render and Vercel
- [ ] Backend is not returning 502 errors
- [ ] Frontend can reach backend (test: https://prepgenius-ai-xogk.onrender.com/api/auth/get-me)
- [ ] Cookies are being set with `SameSite: None` and `Secure: true`
- [ ] CORS includes both frontend and backend URLs

---

## 🔧 If Backend Won't Deploy

**Common Causes:**

1. **Missing Environment Variable**
   - Solution: Add all vars in Render settings

2. **MongoDB Connection Issues**
   - Solution: Check if cluster is accessible from Render IP whitelist
   - Go to MongoDB Atlas → Network Access → Add IP range 0.0.0.0/0

3. **Port Already in Use**
   - Solution: Render auto-assigns port, but our code uses `process.env.PORT || 3000`

4. **Node Version Mismatch**
   - Solution: package.json has `"engines": {"node": "18.x"}`
   - Render might be using different version

---

## 📱 Frontend Deployment Check

After pushing to GitHub:

1. Check Vercel auto-deployment
2. Verify `VITE_API_URL=https://prepgenius-ai-xogk.onrender.com` in `.env`
3. Wait ~60-90 seconds for deployment
4. Test at https://prep-genius-ai-kohl.vercel.app/login

---

## 🎯 Test Sequence

1. **Test Backend alone:**
   ```
   GET https://prepgenius-ai-xogk.onrender.com/api/auth/get-me
   Expected: 401 (no token) ✓
   ```

2. **Test Local (if possible):**
   ```bash
   cd Backend && npm run dev
   cd Frontend && npm run dev
   # Open http://localhost:5173/login
   # Try to register/login
   ```

3. **Test Production:**
   - Go to https://prep-genius-ai-kohl.vercel.app/login
   - Register new account
   - Login
   - Should work ✓

---

## 📊 Common Render Errors

| Error | Cause | Fix |
|-------|-------|-----|
| 502 Bad Gateway | Backend crashed | Check logs, fix issue, redeploy |
| ECONNREFUSED | MongoDB not accessible | Whitelist 0.0.0.0/0 in MongoDB Atlas |
| Cannot find module | Missing dependency | `npm install` locally, then push |
| Environment not found | Missing .env var | Add to Render Settings |
| CORS blocked | Domain not in CORS | Update Backend/src/app.js, push, redeploy |

---

## 💡 Quick Commands to Test

**From your local machine:**

```bash
# Test if backend is up
curl -i https://prepgenius-ai-xogk.onrender.com/api/auth/get-me

# Expected response: 401 with JSON
# {"message":"Token not provided."}

# If you get 502 or timeout - backend is down
```

---

## ✅ Next Actions

1. **Right now:**
   - Check Render logs to see what's failing
   - Verify all environment variables are set
   - Click "Manual Deploy" on Render

2. **Then:**
   - Wait 2-3 minutes for deployment
   - Test backend endpoint
   - Test frontend login

3. **If still broken:**
   - Share the Render log messages with me
   - I'll debug further

