# Setup Groq AI (FREE) - 5 Minutes! 🚀

## What Changed?

- ✅ Replaced Google GenAI with **Groq API** (completely FREE)
- ✅ Same functionality, better limits
- ✅ Works locally and in production
- ✅ Super fast AI responses

---

## ⚡ Quick Setup

### Step 1: Get Free Groq API Key (2 minutes)

1. Go to: https://console.groq.com
2. **Sign up** (free, no credit card needed!)
3. Go to **API Keys** section
4. Click **Create API Key**
5. Copy the key

Example key format:
```
gsk_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### Step 2: Update Your Backend .env

**In `Backend/.env`**, replace the Groq key:

```
MONGO_URI = mongodb+srv://pranit:Br3xYgbAj1Vpmpu9@interview-ai-cluster.cnzgpxe.mongodb.net/
JWT_SECRET = 2939832181455d3eacd608fa0a015548e7b18253c6aa587ac6df68554d94c8a9
GROQ_API_KEY = gsk_YOUR_KEY_HERE_PASTE_HERE
```

---

### Step 3: Test Locally

```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev

# Open: http://localhost:5173/login
# Register → Login → Create Interview Plan → Generate Report
```

---

### Step 4: Deploy to Production

Just push to GitHub:
```bash
git push
```

Both Vercel (frontend) and Render (backend) will auto-deploy!

Update Render environment variable:
1. https://dashboard.render.com
2. PrepGenius-AI service → Settings → Environment
3. Add/Update:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

---

## ✨ Why Groq?

| Feature | Groq | Google GenAI |
|---------|------|-------------|
| **Cost** | FREE ✅ | FREE (quota limited) |
| **Rate Limit** | Generous ✅ | Limited |
| **Speed** | Ultra-fast ✅ | Fast |
| **Setup** | 2 minutes ✅ | Complex |
| **Quality** | Excellent | Excellent |

---

## 🧪 Test It Now!

1. Get Groq key from: https://console.groq.com
2. Update `Backend/.env` with your key
3. Run locally: `npm run dev` (both backend and frontend)
4. Generate your first interview report! 🎉

---

## ❓ FAQ

**Q: Is it really free?**
A: Yes! Groq provides generous free tier for development/testing

**Q: How many requests can I make?**
A: Check Groq console, but plenty for testing and personal use

**Q: Can I use my own API key in production?**
A: Yes! Add it to Render environment variables

**Q: What if key expires?**
A: Generate new key from console.groq.com

---

## 🚀 You're All Set!

Everything is configured and ready. Just add your Groq key and test!

Happy coding! 💪
