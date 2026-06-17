# Portfolio System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for image uploads
- Git for version control

---

## 📦 Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Required Environment Variables**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio
JWT_SECRET=your_super_secret_key_min_32_chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_preset
PORT=5001
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your backend URL
nano .env
```

**Environment Variables**:
```env
VITE_API_URL=http://localhost:5001
VITE_ENV=development
```

---

## 🏃 Running Locally

### Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5001
📍 API available at http://localhost:5001/api
✅ MongoDB connected successfully
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v8.0.2  ready in 123 ms

➜  Local:   http://localhost:5173/
```

### Access the Application

- **Portfolio**: http://localhost:5173
- **Admin Portal**: http://localhost:5173 (click "Admin" button)
- **API Health**: http://localhost:5001/api/health

---

## 🔐 Initial Admin Setup

### Option 1: Using API (Recommended)

```bash
# Send setup request
curl -X POST http://localhost:5001/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_secure_password",
    "setupKey": "your_setup_key_from_env"
  }'
```

### Option 2: Using Admin Portal

1. Go to http://localhost:5173
2. Click "Admin" button
3. You'll see login form (if no admin exists, you can create one)

---

## 🧪 Testing the System

### Test Contact Form

1. Go to http://localhost:5173
2. Scroll to "Get In Touch" section
3. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Subject: "Test Message"
   - Message: "This is a test message"
4. Click "Send Message"
5. Should see success notification

### Test Admin Dashboard

1. Go to http://localhost:5173
2. Click "Admin" button
3. Login with your admin credentials
4. Try each tab:
   - **Overview**: View statistics
   - **Projects**: Create/edit/delete projects
   - **PhotoLog**: View project images
   - **Messages**: View contact messages
   - **Settings**: Update profile

### Test Project Creation

1. Login to admin dashboard
2. Go to "Projects" tab
3. Click "Create New Project"
4. Fill in form:
   - Title: "My Awesome Project"
   - Description: "A description of the project"
   - Technologies: "React, Node.js, MongoDB"
   - GitHub URL: "https://github.com/user/repo"
   - Demo URL: "https://demo.example.com"
   - Upload an image
5. Click "Publish Project"
6. Should see success notification
7. Project should appear in portfolio

---

## 🔍 API Testing

### Health Check

```bash
curl http://localhost:5001/api/health
```

Response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Get All Projects

```bash
curl http://localhost:5001/api/projects
```

### Submit Contact Message

```bash
curl -X POST http://localhost:5001/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

### Admin Login

```bash
curl -X POST http://localhost:5001/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }'
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin"
  }
}
```

### Get Admin Profile (Requires Token)

```bash
curl http://localhost:5001/api/admin/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   └── upload.js         # File upload handling
│   ├── models/
│   │   ├── Admin.js          # Admin user model
│   │   ├── Project.js        # Project model
│   │   └── Message.js        # Contact message model
│   ├── routes/
│   │   ├── admin.js          # Admin routes
│   │   ├── projects.js       # Project routes
│   │   └── messages.js       # Message routes
│   ├── server.js             # Express server
│   ├── package.json
│   └── .env                  # Environment variables
│
└── frontend/
    ├── client/
    │   ├── components/
    │   │   ├── Navigation.tsx
    │   │   ├── CloudinaryImage.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminLogin.jsx
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── ProjectsManager.jsx
    │   │   │   ├── MessagesManager.jsx
    │   │   │   ├── AdminSettings.jsx
    │   │   │   └── PhotoLogManager.jsx
    │   │   └── sections/
    │   │       ├── HeroSection.tsx
    │   │       ├── AboutSection.tsx
    │   │       ├── SkillsSection.tsx
    │   │       ├── ProjectsSection.tsx
    │   │       ├── ExperienceSection.tsx
    │   │       └── EducationSection.tsx
    │   ├── lib/
    │   │   ├── api.ts         # API configuration
    │   │   └── utils.ts       # Utility functions
    │   ├── hooks/
    │   │   └── use-toast.ts   # Toast notifications
    │   ├── pages/
    │   │   ├── Index.tsx      # Main portfolio page
    │   │   └── NotFound.tsx   # 404 page
    │   └── App.tsx            # Main app component
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── .env                   # Environment variables
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `Cannot find module 'express'`
- **Solution**: Run `npm install` in backend directory

**Error**: `MONGODB_URI is not defined`
- **Solution**: Create `.env` file with `MONGODB_URI` variable

**Error**: `Port 5001 already in use`
- **Solution**: Change PORT in `.env` or kill process using port 5001

### Frontend Won't Start

**Error**: `Cannot find module '@/components/...'`
- **Solution**: Check import paths, should use `@` alias

**Error**: `API connection refused`
- **Solution**: Ensure backend is running and `VITE_API_URL` is correct

### Contact Form Not Submitting

**Error**: `CORS error`
- **Solution**: Check CORS whitelist in `backend/server.js`

**Error**: `Email validation failed`
- **Solution**: Use valid email format (e.g., user@example.com)

### Admin Login Fails

**Error**: `Invalid credentials`
- **Solution**: Verify username and password are correct

**Error**: `No authentication token`
- **Solution**: Ensure admin is created first using setup endpoint

### Images Not Loading

**Error**: `Image not available`
- **Solution**: Check Cloudinary credentials and upload preset

**Error**: `Failed to load image`
- **Solution**: Verify image URL is accessible

---

## 📚 Documentation

- **Full Analysis**: See `PROJECT_ANALYSIS.md`
- **Stability Report**: See `STABILITY_REPORT.md`
- **Fixes Summary**: See `FIXES_SUMMARY.md`

---

## 🚀 Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Connect GitHub to Render
3. Create new Web Service
4. Set environment variables
5. Deploy

### Deploy Frontend to Vercel

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set environment variables
4. Deploy

See `STABILITY_REPORT.md` for detailed deployment steps.

---

## 📞 Support

### Common Issues

| Issue | Solution |
|-------|----------|
| Backend won't connect | Check MongoDB URI and internet connection |
| Images not uploading | Verify Cloudinary credentials |
| Contact form not working | Check email validation and API URL |
| Admin login fails | Verify admin exists and credentials are correct |
| CORS errors | Check CORS whitelist in server.js |

### Getting Help

1. Check error messages in console
2. Review `STABILITY_REPORT.md` troubleshooting section
3. Check API logs: `curl http://localhost:5001/api/health`
4. Verify environment variables are set correctly

---

## ✅ Checklist

- [ ] Backend running on port 5001
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] Admin user created
- [ ] Contact form working
- [ ] Projects displaying
- [ ] Images loading
- [ ] Admin dashboard accessible
- [ ] All tests passing

---

## 🎉 You're Ready!

Your portfolio system is now set up and ready to use. Start by:

1. Creating some projects
2. Testing the contact form
3. Customizing the portfolio content
4. Deploying to production

Good luck! 🚀

---

**Last Updated**: April 29, 2026  
**Status**: Ready to Use ✅
