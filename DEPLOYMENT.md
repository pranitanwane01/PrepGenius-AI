# PrepGenius-AI Deployment Guide

## Backend (Render Deployment)

### Prerequisites
- MongoDB Atlas account (for MONGO_URI)
- Google GenAI API key from Google AI Studio
- Render account

### Required Environment Variables on Render

Set these in your Render service's Environment tab:

```
MONGO_URI=mongodb+srv://pranit:Br3xYgbAj1Vpmpu9@interview-ai-cluster.cnzgpxe.mongodb.net/
GOOGLE_GENAI_API_KEY=AIzaSyD6ENtUKDZgHvgQr64itXc8VRMpN2NnhFY
JWT_SECRET=2939832181455d3eacd608fa0a015548e7b18253c6aa587ac6df68554d94c8a9
PORT=3000
NODE_ENV=production
```

### Issues & Solutions

#### 1. **Deployment Fails with "fix: gemini model + pdf parse fix"**
- **Cause**: Missing environment variables
- **Solution**: Add all environment variables listed above to Render dashboard

#### 2. **CORS Errors in Browser**
- **Cause**: Frontend domain not in CORS whitelist
- **Solution**: The backend now supports:
  - `http://localhost:5173` (local dev)
  - `http://localhost:3000` (local backend)
  - `https://prep-genius-ai-kohl.vercel.app` (Vercel)
  - `https://prepgenius-ai-wgok.onrender.com` (Render)

#### 3. **Cookie Not Being Sent**
- **Info**: Cookies are set with `sameSite: "None"` and `secure: true` for cross-origin requests
- **Requirement**: Frontend must use `withCredentials: true` in axios

---

## Frontend (Vercel Deployment)

### Environment Variables (.env)
```
VITE_API_URL=https://prepgenius-ai-wgok.onrender.com
```

### Build Command
```bash
npm run build
```

### Start Command
```bash
npm run preview
```

---

## Local Development

### Backend Setup
```bash
cd Backend
npm install
# Copy .env.example to .env and fill in values
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`
The backend will run on `http://localhost:3000`

---

## API Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/get-me` - Get current user (requires token)

### Interview Endpoints
- `POST /api/interview/` - Generate interview report
- `GET /api/interview/` - Get all reports
- `GET /api/interview/report/:interviewId` - Get specific report
- `POST /api/interview/resume/pdf/:interviewReportId` - Generate resume PDF

---

## Troubleshooting

### Server won't start
1. Check if MONGO_URI is correct
2. Verify MongoDB Atlas cluster is accessible
3. Ensure Node.js version is 18.x or higher

### AI generation fails
1. Verify GOOGLE_GENAI_API_KEY is valid
2. Check Google GenAI API quota
3. Ensure your JSON schema is properly formatted

### PDF generation fails
1. Puppeteer might need additional setup on Render
2. Use the fallback HTML generation
3. Check server logs on Render dashboard

