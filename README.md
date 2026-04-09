# ✨ SmartResume AI

![SmartResume AI Banner](./public/promo_banner.png)

> **The React-based frontend for an AI-powered SaaS resume builder. Build, customize, and export professional resumes with real-time AI assistance.**

🌐 **Live App**: [smartresumebuilder.onrender.com](https://smartresumebuilder.onrender.com)  
⚙️ **Backend Repo**: [ResumeBuilder (Flask API)](https://github.com/Sagnikroy12/ResumeBuilder)  

---

## 🚀 Key Features

- 🪄 **AI Magic Suggestions**: Real-time content suggestions for objectives, experience, and skills powered by OpenAI, Gemini, Claude, and DeepSeek.
- 🖼️ **Premium Templates**: Choose from classic, modern, and executive templates designed by industry experts.
- ⚡ **Live A4 Preview**: See your changes in real-time with an accurate A4-scaled preview.
- 🛠️ **Smart Import & Tailoring**: Upload your existing PDF or paste a Job Description, and let AI tailor your resume to beat the ATS.
- 🔐 **User Authentication**: Secure login/register with persistent sessions.
- 💎 **Pro Features**: Unlock unlimited downloads, priority support, and advanced AI models.

---

## 🏗️ Architecture

This is the **frontend** of a decoupled full-stack application:

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────┐
│   React Frontend    │  REST   │   Flask Backend     │  SQL    │   PostgreSQL    │
│   (Netlify/Render)  │ ◄─────► │   (Render)          │ ◄─────► │   (Supabase)    │
└─────────────────────┘         └─────────────────────┘         └─────────────────┘
         │                               │
         ▼                               ▼
   Static Hosting               ┌─────────────────┐
                                │   AI Services   │
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
| **Styling**     | Vanilla CSS (Glassmorphism Design)      |
| **HTTP Client** | Axios (with credentials for sessions)   |
| **Icons**       | Lucide React                            |
| **State**       | React Context API                       |
| **Linting**     | ESLint 9 with React Hooks plugin        |

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
├── package.json                 # Dependencies & scripts
└── README.md                    # This file
```

---

## 📦 Quick Start

### Prerequisites

- Node.js (v18+)
- npm / yarn

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Sagnikroy12/ResumeBuilder-Frontend.git
   cd ResumeBuilder-Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Build for Production

```bash
npm run build                  # Output in /dist
npm run preview                # Preview production build
```

---

## 📸 Screenshots

| Dashboard | Resume Builder |
|-----------|----------------|
| ![Dashboard](./src/assets/hero.png) | *Live Preview System* |

---

## 🔗 Related Repositories

| Repository | Description | Tech |
|------------|-------------|------|
| [ResumeBuilder](https://github.com/Sagnikroy12/ResumeBuilder) | Backend REST API | Flask, PostgreSQL |
| **This Repo** | Frontend Application | React, Vite |

---

## 📄 License & Author

**Sagnik Roy**  
📧 sagnikroyofficial24@gmail.com  
🔗 [GitHub](https://github.com/Sagnikroy12)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">Made with ❤️ for professionals worldwide.</p>
