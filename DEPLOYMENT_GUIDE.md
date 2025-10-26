# LeadStream CRM - Complete Deployment Guide

## 🚀 Deployment Architecture

```
Frontend (Netlify) → Backend (Render/Railway) → Databases (MongoDB Atlas + Upstash Redis)
```

---

## 📋 Pre-Deployment Checklist

### ✅ What You Need:
- [ ] GitHub account
- [ ] Netlify account (free)
- [ ] Render.com account (free) OR Railway.app account (free)
- [ ] MongoDB Atlas account (free)
- [ ] Upstash account (free Redis)

---

## Part 1: Setup Databases (Free Tier)

### 🍃 MongoDB Atlas (Free 512MB)

**Step 1: Create Account**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email/Google
3. Choose **FREE M0 cluster**

**Step 2: Create Cluster**
1. Click "Build a Database"
2. Choose **FREE Shared Cluster**
3. Select cloud provider: **AWS**
4. Region: Choose closest to you
5. Cluster name: `leadstream-cluster`
6. Click **Create**

**Step 3: Create Database User**
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `leadstream-admin`
4. Password: Generate strong password (SAVE THIS!)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

**Step 4: Whitelist IP Addresses**
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

**Step 5: Get Connection String**
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
```
mongodb+srv://leadstream-admin:<password>@leadstream-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password
6. **SAVE THIS CONNECTION STRING!**

---

### ⚡ Upstash Redis (Free 10,000 commands/day)

**Step 1: Create Account**
1. Go to https://upstash.com/
2. Sign up with email/Google
3. Verify email

**Step 2: Create Redis Database**
1. Click "Create Database"
2. Name: `leadstream-redis`
3. Type: **Regional**
4. Region: Choose closest to you
5. Click "Create"

**Step 3: Get Connection Details**
1. Click on your database name
2. Scroll to "REST API"
3. Copy **UPSTASH_REDIS_REST_URL**
4. **SAVE THIS URL!**

Example:
```
redis://default:xxxxxxxxxxxxx@useast-12345.upstash.io:6379
```

---

## Part 2: Deploy Backend to Render (Free Tier)

### 🔧 Render.com (Free 750 hours/month)

**Step 1: Prepare Backend**

Create `backend/.env.production`:
```bash
PORT=5001
MONGODB_URI=mongodb+srv://leadstream-admin:YOUR_PASSWORD@leadstream-cluster.xxxxx.mongodb.net/leadstream?retryWrites=true&w=majority
REDIS_URL=redis://default:xxxxx@useast-12345.upstash.io:6379
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long-change-this
FRONTEND_URL=https://your-app-name.netlify.app
NODE_ENV=production
```

**Step 2: Push to GitHub**

```bash
# In project root
git init
git add .
git commit -m "Initial commit - LeadStream CRM"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/leadstream-crm.git
git branch -M main
git push -u origin main
```

**Step 3: Deploy on Render**

1. Go to https://render.com/
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `leadstream-backend`
   - **Region**: Choose closest to you
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. Add Environment Variables (click "Advanced"):
   - `MONGODB_URI`: Your MongoDB connection string
   - `REDIS_URL`: Your Upstash Redis URL
   - `JWT_SECRET`: Strong random string (min 32 chars)
   - `FRONTEND_URL`: https://your-app-name.netlify.app
   - `NODE_ENV`: production
   - `PORT`: 5001

7. Click **Create Web Service**

8. Wait 5-10 minutes for deployment

9. Your backend will be at: `https://leadstream-backend.onrender.com`

**Step 4: Test Backend**

```bash
curl https://leadstream-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "OK",
  "server": "LeadStream CRM API",
  "mongoConnected": true,
  "redisConnected": true
}
```

---

## Part 3: Deploy Frontend to Netlify

### 🌐 Netlify Deployment

**Step 1: Prepare Frontend**

Create `frontend/.env.production`:
```bash
REACT_APP_API_URL=https://leadstream-backend.onrender.com/api
```

**Step 2: Create Netlify Configuration**

Create `frontend/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**Step 3: Deploy to Netlify**

**Option A: Netlify CLI (Recommended)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from frontend directory
cd frontend
netlify init

# Follow prompts:
# - Create & configure a new site
# - Site name: leadstream-crm (or your choice)
# - Build command: npm run build
# - Publish directory: build

# Deploy
netlify deploy --prod
```

**Option B: Netlify Dashboard**

1. Go to https://app.netlify.com/
2. Sign up/Login with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub → Select your repository
5. Configure:
   - **Branch**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

6. Add Environment Variables:
   - `REACT_APP_API_URL`: https://leadstream-backend.onrender.com/api

7. Click **Deploy site**

8. Wait 2-5 minutes

9. Your site will be at: `https://YOUR_SITE_NAME.netlify.app`

**Step 4: Update Backend CORS**

Go back to Render.com:
1. Click your backend service
2. Go to "Environment"
3. Update `FRONTEND_URL` to your actual Netlify URL
4. Click "Save Changes"
5. Service will auto-redeploy

---

## Part 4: Post-Deployment Setup

### 📧 Update Environment Variables

**Frontend (Netlify):**
```bash
REACT_APP_API_URL=https://leadstream-backend.onrender.com/api
```

**Backend (Render):**
```bash
PORT=5001
MONGODB_URI=mongodb+srv://leadstream-admin:PASSWORD@cluster.mongodb.net/leadstream
REDIS_URL=redis://default:xxxxx@redis.upstash.io:6379
JWT_SECRET=your-super-secret-key-change-this-min-32-chars
FRONTEND_URL=https://your-app-name.netlify.app
NODE_ENV=production
```

### 🎯 Create Admin User

```bash
# Option 1: Via setup script (modify with production DB URI)
node setup-data.js

# Option 2: Via MongoDB Atlas Dashboard
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Database: leadstream
4. Collection: users
5. Click "Insert Document"
6. Add:
{
  "name": "Admin User",
  "email": "admin@leadstream.com",
  "password": "$2a$12$hashed_password_here",
  "role": "admin",
  "isActive": true,
  "createdAt": "2025-10-26T00:00:00.000Z"
}
```

---

## Part 5: Custom Domain (Optional)

### 🌍 Setup Custom Domain on Netlify

**Step 1: Buy Domain**
- Namecheap, GoDaddy, Google Domains, etc.
- Example: `leadstream-crm.com`

**Step 2: Add to Netlify**
1. Go to Netlify Dashboard
2. Click your site
3. Go to "Domain settings"
4. Click "Add custom domain"
5. Enter your domain: `leadstream-crm.com`
6. Click "Verify"

**Step 3: Configure DNS**

On your domain registrar:
1. Add **A Record**:
   - Name: `@`
   - Value: `75.2.60.5` (Netlify's load balancer)

2. Add **CNAME Record**:
   - Name: `www`
   - Value: `YOUR_SITE_NAME.netlify.app`

**Step 4: Enable HTTPS**
- Netlify automatically provisions SSL certificate
- Wait 24 hours for DNS propagation

**Step 5: Update Backend**
- Update `FRONTEND_URL` in Render to `https://leadstream-crm.com`

---

## Alternative Backend Hosting Options

### 🚂 Railway.app (Alternative to Render)

**Pros:**
- Free $5/month credit
- Easy GitHub integration
- Automatic deployments
- Built-in Redis addon

**Deploy Steps:**
1. Go to https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select repository
5. Add service: Node.js
6. Set Root Directory: `backend`
7. Add environment variables
8. Add Redis addon (click "New" → "Database" → "Add Redis")
9. Deploy!

### 🌊 Heroku (Paid but easy)

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create leadstream-backend

# Add addons
heroku addons:create mongolab:sandbox
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET="your-secret"
heroku config:set FRONTEND_URL="https://your-app.netlify.app"

# Deploy
git push heroku main
```

### ☁️ DigitalOcean App Platform

**Pros:**
- $5/month for everything
- Includes databases
- Great performance

**Steps:**
1. Sign up at https://www.digitalocean.com/
2. Create new App
3. Connect GitHub
4. Select repository
5. Configure components
6. Deploy!

---

## 🔍 Monitoring & Debugging

### **Check Deployment Status:**

**Frontend (Netlify):**
- Dashboard: https://app.netlify.com/
- Logs: Click site → "Deploys" → View deploy logs
- Functions: Check if all routes work

**Backend (Render):**
- Dashboard: https://dashboard.render.com/
- Logs: Click service → "Logs" tab
- Health: https://your-backend.onrender.com/api/health

**Databases:**
- MongoDB: Atlas dashboard → Database → Metrics
- Redis: Upstash dashboard → Database → Metrics

### **Common Issues:**

**1. CORS Errors**
```javascript
// backend/src/app.js
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";
// Make sure this matches your Netlify URL exactly
```

**2. API Not Connecting**
- Check `REACT_APP_API_URL` in Netlify env vars
- Verify backend health endpoint
- Check browser console for errors

**3. Database Connection Failed**
- Verify MongoDB URI is correct
- Check IP whitelist (should include 0.0.0.0/0)
- Ensure database user has correct permissions

**4. Socket.IO Not Working**
- Check CORS settings include Socket.IO transport
- Verify WebSocket support enabled
- Check browser console for connection errors

---

## 📊 Deployment Costs

### **Free Tier (Recommended for MVP):**

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| Netlify | Free | $0 | 100GB bandwidth/month |
| Render | Free | $0 | 750 hours/month (auto-sleep) |
| MongoDB Atlas | M0 | $0 | 512MB storage |
| Upstash Redis | Free | $0 | 10K commands/day |
| **Total** | | **$0/month** | Suitable for 100-500 users |

### **Production (Recommended for Launch):**

| Service | Plan | Cost | Features |
|---------|------|------|----------|
| Netlify | Pro | $19/month | 1TB bandwidth, CDN |
| Render | Starter | $7/month | Always on, 512MB RAM |
| MongoDB Atlas | M10 | $57/month | 10GB storage, backups |
| Upstash Redis | Pay-as-go | ~$5/month | 1M commands |
| **Total** | | **~$88/month** | Handles 10K+ users |

---

## 🔐 Security Checklist

### **Before Going Live:**

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS on all endpoints
- [ ] Set up environment variables (never commit secrets)
- [ ] Enable MongoDB IP whitelist
- [ ] Enable rate limiting (already configured)
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable database backups
- [ ] Review CORS settings
- [ ] Test all API endpoints
- [ ] Enable 2FA on all accounts (GitHub, Netlify, etc.)

---

## 🚀 Quick Deployment Checklist

```bash
# 1. Setup Databases
□ Create MongoDB Atlas cluster
□ Create Upstash Redis database
□ Save connection strings

# 2. Deploy Backend
□ Push code to GitHub
□ Create Render/Railway account
□ Deploy backend service
□ Add environment variables
□ Test health endpoint

# 3. Deploy Frontend
□ Create Netlify account
□ Deploy from GitHub or CLI
□ Add environment variables
□ Test site loads

# 4. Connect Everything
□ Update backend FRONTEND_URL
□ Update frontend API_URL
□ Test login/signup
□ Test AI chat
□ Test real-time features

# 5. Create Admin User
□ Run setup script OR
□ Create manually in MongoDB

# 6. Go Live!
□ Share URL with team
□ Monitor logs
□ Check analytics
```

---

## 📱 Progressive Web App (Bonus)

Make it installable on mobile:

**frontend/public/manifest.json** (already exists):
```json
{
  "short_name": "LeadStream",
  "name": "LeadStream CRM",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff"
}
```

Users can now "Add to Home Screen" on mobile!

---

## 🎯 Post-Deployment Testing

### **Test List:**

1. **Authentication**
   - [ ] Register new user
   - [ ] Login with credentials
   - [ ] Logout
   - [ ] Protected routes redirect

2. **Lead Management**
   - [ ] Create lead
   - [ ] Edit lead
   - [ ] Delete lead
   - [ ] Search/filter leads

3. **Pipeline**
   - [ ] Drag-drop deals
   - [ ] View metrics
   - [ ] Filter deals

4. **Tasks**
   - [ ] Create task
   - [ ] Mark complete
   - [ ] Delete task

5. **AI Chat**
   - [ ] Open chat widget
   - [ ] Ask question
   - [ ] Get AI response
   - [ ] Transfer to agent

6. **Real-Time**
   - [ ] Notifications work
   - [ ] Socket.IO connected
   - [ ] Live updates appear

7. **Mobile**
   - [ ] Responsive on phone
   - [ ] Touch interactions work
   - [ ] Chat widget works

---

## 📧 Support & Help

**If something goes wrong:**

1. Check deployment logs (Netlify/Render)
2. Verify environment variables
3. Test backend health endpoint
4. Check browser console
5. Review CORS settings

**Resources:**
- Netlify Docs: https://docs.netlify.com/
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
- Upstash Docs: https://upstash.com/docs

---

## 🎉 Congratulations!

Your **LeadStream CRM** is now live and accessible worldwide!

**Share it:**
- https://your-app-name.netlify.app
- Team members can signup
- Start managing leads!

---

## 📈 Next Steps

1. **Monitor usage** with Netlify/Render analytics
2. **Add custom domain** for professional look
3. **Enable error tracking** (Sentry)
4. **Set up backups** for databases
5. **Create documentation** for users
6. **Gather feedback** from early users
7. **Plan v2 features**

---

**Built with ❤️ by Kingdom (Emmanuel Tobi)**

*LeadStream CRM - Now Live on the Internet!* 🚀
