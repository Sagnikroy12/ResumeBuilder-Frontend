# 🎨 AI-Powered Resume Builder — Frontend

> **The React-based frontend for an AI-powered SaaS resume builder. Build, customize, and export professional resumes with real-time AI assistance.**

🌐 **Live App**: [aipoweredresumebuilder.netlify.app](https://aipoweredresumebuilder.netlify.app)  
⚙️ **Backend Repo**: [ResumeBuilder (Flask API)](https://github.com/Sagnikroy12/ResumeBuilder)  
🔗 **Backend API**: [smartresumebuilder.onrender.com](https://smartresumebuilder.onrender.com)

---

## ✨ Features

- 🤖 **AI-Powered Content** — Generate professional resume content using multiple AI providers (Gemini, OpenAI, Claude, DeepSeek)
- 📝 **Interactive Resume Builder** — Drag-and-drop sections with real-time preview
- 📄 **Multiple Templates** — Classic, Modern, and ATS-optimized professional designs
- 📤 **PDF Upload & Tailor** — Upload existing resumes and AI-tailor them for specific job descriptions
- 🔐 **User Authentication** — Secure login/register with persistent sessions
- 💎 **Premium Tier** — Upgrade flow with tiered access control
- 📱 **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast & Modern** — Built with React 19 + Vite 8 for instant HMR and optimized builds

---

## 🏗️ Architecture

This is the **frontend** of a decoupled full-stack application:

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────┐
│   React Frontend    │  REST   │   Flask Backend      │  SQL    │   PostgreSQL    │
│   (Netlify)         │ ◄─────► │   (Render)           │ ◄─────► │   (Supabase)    │
└─────────────────────┘         └─────────────────────┘         └─────────────────┘
         │                               │
         ▼                               ▼
   Netlify CDN                  ┌─────────────────┐
   (Static Hosting)             │   AI Services   │
                                │  Gemini/OpenAI  │
                                │  Claude/DeepSeek│
                                └─────────────────┘
```

---

## 🛠️ Tech Stack

| Category        | Technology                              |
|-----------------|-----------------------------------------|
| **Framework**   | React 19 with JSX                       |
| **Build Tool**  | Vite 8                                  |
| **Routing**     | React Router DOM 7                      |
| **HTTP Client** | Axios (with credentials for sessions)   |
| **Icons**       | Lucide React                            |
| **State**       | React Context API                       |
| **Linting**     | ESLint 9 with React Hooks plugin        |
| **Hosting**     | Netlify (Continuous Deployment)         |

---

## 📁 Project Structure

```
ResumeBuilder-Frontend/
├── public/                       # Static assets
├── src/
│   ├── components/              # Reusable UI components
│   │   └── Navbar.jsx           # Navigation bar with auth state
│   ├── context/                 # React Context providers
│   ├── pages/                   # Application pages
│   │   ├── LoginPage.jsx        # User authentication
│   │   ├── RegisterPage.jsx     # New user registration
│   │   ├── DashboardPage.jsx    # User dashboard & saved resumes
│   │   ├── ResumeBuilderPage.jsx # Main resume editor with AI
│   │   ├── TailorPage.jsx       # AI resume tailoring for job descriptions
│   │   ├── UploadPage.jsx       # Resume PDF upload & parsing
│   │   ├── UpgradePage.jsx      # Premium tier upgrade
│   │   └── PaymentPage.jsx      # Payment processing
│   ├── services/
│   │   └── api.js               # Axios API client configuration
│   ├── App.jsx                  # Root component with routing
│   ├── App.css                  # Global component styles
│   ├── index.css                # Design system & theme
│   └── main.jsx                 # Application entry point
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone
git clone https://github.com/Sagnikroy12/ResumeBuilder-Frontend.git
cd ResumeBuilder-Frontend

# Install dependencies
npm install

# Start dev server
npm run dev                    # http://localhost:5173
```

### Build for Production

```bash
npm run build                  # Output in /dist
npm run preview                # Preview production build
```

---

## 🔗 Related Repositories

| Repository | Description | Tech |
|------------|-------------|------|
| [ResumeBuilder](https://github.com/Sagnikroy12/ResumeBuilder) | Backend REST API | Flask, PostgreSQL, Gunicorn |
| **This Repo** | Frontend Application | React, Vite, Netlify |

---

## 📜 License

MIT License

## 👤 Author

**Sagnik Roy**  
📧 sagnikroyofficial24@gmail.com  
🔗 [GitHub](https://github.com/Sagnikroy12)

---

**Status**: Production Ready ✅ · **Version**: 1.0.0 · **Last Updated**: April 2026
