# 🚀 Quick Deploy - LeadStream CRM

Follow these steps in order to deploy your CRM to the cloud in under 30 minutes!

---

## Step 1: Setup Free Cloud Databases (10 minutes)

### A. MongoDB Atlas
1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster** (M0 - 512MB)
3. **Create database user**:
   - Username: `leadstream-admin`
   - Password: (generate strong one - SAVE IT!)
4. **Whitelist all IPs**: Network Access → Add IP → 0.0.0.0/0
5. **Get connection string**:
   ```
   mongodb+srv://leadstream-admin:YOUR_PASSWORD@cluster.mongodb.net/leadstream
   ```
   **SAVE THIS!** ✅

### B. Upstash Redis
1. **Sign up**: https://upstash.com/
2. **Create database**: Regional, choose your region
3. **Copy Redis URL**:
   ```
   redis://default:xxxxx@us1-12345.upstash.io:6379
   ```
   **SAVE THIS!** ✅

---

## Step 2: Deploy Backend to Render (10 minutes)

### A. Push Code to GitHub
```bash
cd "C:\Users\emmat\OneDrive\Desktop\LeadStream CRM Web-App"

git init
git add .
git commit -m "Initial commit - LeadStream CRM ready for deployment"

# Create new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/leadstream-crm.git
git branch -M main
git push -u origin main
```

### B. Deploy on Render
1. **Sign up**: https://render.com/ (use GitHub)
2. **New Web Service** → Connect your repo
3. **Configure**:
   - Name: `leadstream-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

4. **Environment Variables** (click Advanced):
   ```
   MONGODB_URI = [your MongoDB connection string]
   REDIS_URL = [your Upstash Redis URL]
   JWT_SECRET = [generate random 32+ character string]
   FRONTEND_URL = https://leadstream-crm.netlify.app
   NODE_ENV = production
   PORT = 5001
   ```

5. **Create Web Service** → Wait 5-10 minutes

6. **Your backend URL**: https://leadstream-backend.onrender.com

7. **Test it**:
   ```bash
   curl https://leadstream-backend.onrender.com/api/health
   ```
   Should return: `{"status":"OK","mongoConnected":true,...}`

---

## Step 3: Deploy Frontend to Netlify (5 minutes)

### Option A: Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy frontend
cd frontend
netlify deploy --prod

# Follow prompts:
# - Create new site
# - Name: leadstream-crm
# - Build: npm run build
# - Directory: build

# Your site: https://leadstream-crm.netlify.app
```

### Option B: Netlify Dashboard

1. **Sign up**: https://app.netlify.com/ (use GitHub)
2. **New site from Git** → GitHub → Your repo
3. **Configure**:
   - Branch: `main`
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`

4. **Environment Variables** (Site settings → Build & deploy):
   ```
   REACT_APP_API_URL = https://leadstream-backend.onrender.com/api
   ```

5. **Deploy site** → Wait 2-5 minutes

6. **Your site**: https://YOUR_SITE_NAME.netlify.app

---

## Step 4: Connect Everything (5 minutes)

### A. Update Backend CORS

1. Go to **Render dashboard**
2. Click **leadstream-backend**
3. Go to **Environment** tab
4. Update `FRONTEND_URL` to your actual Netlify URL:
   ```
   FRONTEND_URL = https://YOUR_ACTUAL_SITE.netlify.app
   ```
5. **Save** → Service will auto-redeploy (2-3 minutes)

### B. Create Admin User

Option 1 - **Using MongoDB Atlas Dashboard**:
1. Go to MongoDB Atlas → Database → Browse Collections
2. Database: `leadstream` → Collection: `users`
3. **Insert Document**:
```json
{
  "name": "Admin User",
  "email": "admin@leadstream.com",
  "password": "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5aeGK3eqJ7JfW",
  "role": "admin",
  "isActive": true,
  "createdAt": {"$date": "2025-10-26T00:00:00.000Z"},
  "updatedAt": {"$date": "2025-10-26T00:00:00.000Z"}
}
```
*This password is: `admin123` (change after first login!)*

Option 2 - **Via Frontend**:
1. Go to your Netlify URL
2. Click **Register**
3. Create account with role: **Admin**
4. Login immediately

---

## Step 5: Test Everything (5 minutes)

### ✅ Checklist:

1. **Open your Netlify URL**: https://YOUR_SITE.netlify.app
2. **Login** with admin credentials
3. **Test Features**:
   - [ ] Dashboard loads
   - [ ] Create a lead
   - [ ] Open AI Chat (bottom-right)
   - [ ] Ask: "How do I create a lead?"
   - [ ] Go to Pipeline
   - [ ] Go to Tasks
   - [ ] Check notifications (bell icon)
   - [ ] Drag-drop in pipeline

4. **Check Real-Time**:
   - [ ] Open chat widget
   - [ ] AI responds
   - [ ] Notifications appear
   - [ ] All features work

---

## 🎉 You're Live!

**Your URLs:**
- 🌐 Frontend: https://YOUR_SITE.netlify.app
- 🔧 Backend: https://leadstream-backend.onrender.com
- 📊 MongoDB: (via Atlas dashboard)
- ⚡ Redis: (via Upstash dashboard)

---

## ⚠️ Important Notes

### Free Tier Limitations:

**Render (Backend)**:
- ✅ 750 hours/month (enough for 1 site)
- ⚠️ Sleeps after 15 minutes of inactivity
- ⚠️ Takes 30-60 seconds to wake up on first request
- 💡 Solution: Upgrade to Starter ($7/month) for always-on

**Netlify (Frontend)**:
- ✅ 100GB bandwidth/month
- ✅ Unlimited sites
- ✅ Always fast (CDN)

**MongoDB Atlas**:
- ✅ 512MB storage (good for 10,000+ leads)
- ✅ Shared cluster (slightly slower)

**Upstash Redis**:
- ✅ 10,000 commands/day
- ✅ Perfect for MVP

### Keep Backend Awake (Free Option):

Use a service like **UptimeRobot** (free):
1. Sign up: https://uptimerobot.com/
2. Add monitor:
   - Type: HTTP(s)
   - URL: https://leadstream-backend.onrender.com/api/health
   - Interval: 5 minutes
3. This pings your backend every 5 minutes to keep it awake!

---

## 🔐 Security Checklist

Before sharing with users:

- [ ] Change default admin password
- [ ] Generate new JWT_SECRET (32+ chars random)
- [ ] Verify all environment variables are set
- [ ] Test HTTPS on all URLs
- [ ] Enable 2FA on GitHub, Netlify, Render accounts
- [ ] Review MongoDB IP whitelist
- [ ] Check Netlify/Render logs for errors

---

## 📱 Share With Team

Send this to your team:

```
🎉 LeadStream CRM is now live!

URL: https://YOUR_SITE.netlify.app

Login:
1. Click "Register" to create account
2. Choose your role (Sales Rep, Manager)
3. Start managing leads!

Features:
- AI Chat Assistant (bottom-right corner)
- Real-time notifications
- Drag-drop pipeline
- Task management
- Analytics dashboard

Questions? Ask the AI chat! 🤖
```

---

## 🆘 Troubleshooting

### "Cannot connect to backend"
- Check `REACT_APP_API_URL` in Netlify env vars
- Verify backend is deployed on Render
- Test: https://your-backend.onrender.com/api/health

### "CORS error"
- Update `FRONTEND_URL` in Render to exact Netlify URL
- Include https:// and no trailing slash
- Redeploy backend after change

### "Database connection failed"
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Ensure database user exists with permissions

### "Chat not working"
- Check Socket.IO connection (green dot on chat button)
- Verify backend URL in console
- Check browser console for errors

### "Slow first load"
- Render free tier sleeps after 15 min inactivity
- First request wakes it (30-60 sec wait)
- Use UptimeRobot to keep awake OR upgrade to paid

---

## 🚀 Upgrade to Production

When ready for real users:

### Recommended Upgrades:

1. **Render Starter** ($7/month)
   - Always-on (no sleep)
   - 512MB RAM
   - Much faster

2. **MongoDB Atlas M10** ($57/month)
   - 10GB storage
   - Automated backups
   - Better performance

3. **Custom Domain** ($10-15/year)
   - leadstream-crm.com
   - Professional look
   - Better branding

4. **Monitoring** (Free-$20/month)
   - Sentry for error tracking
   - LogRocket for session replay
   - Google Analytics

**Total Production Cost**: ~$70-100/month for serious business use

---

## 📞 Next Steps

1. ✅ Customize branding (colors, logo)
2. ✅ Add your own AI knowledge base entries
3. ✅ Invite team members
4. ✅ Import existing leads
5. ✅ Set up email notifications
6. ✅ Configure integrations
7. ✅ Train team on features
8. ✅ Gather feedback
9. ✅ Iterate and improve!

---

## 🎓 Resources

- **Full Guide**: DEPLOYMENT_GUIDE.md
- **MVP Features**: MVP_READINESS_GUIDE.md
- **AI Chat**: AI_CHAT_GUIDE.md
- **Netlify Docs**: https://docs.netlify.com/
- **Render Docs**: https://render.com/docs
- **Support**: Create GitHub issues

---

**Congratulations! Your CRM is live! 🎊**

Built with ❤️ by Kingdom (Emmanuel Tobi)
