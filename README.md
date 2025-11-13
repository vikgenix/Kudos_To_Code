# 🚀 Kudos to Code — Coding Profile Builder

A unified platform that aggregates your coding journey — projects, stats, and competitive programming profiles — into one dynamic portfolio.
Showcase your achievements, GitHub activity, and competitive programming stats from platforms like LeetCode, Codeforces, and more, all with a single, shareable link.

## 🧩 Problem Statement

Developers today have their work scattered across platforms — GitHub for projects, LeetCode for problems, Codeforces for contests, etc.
Kudos to Code solves this by creating a centralized, unified profile builder that brings together all your coding stats, projects, and achievements into a sleek, personalized portfolio.

“One profile. One link. Your entire coding identity.”

## 🏗️ System Architecture

Kudos to Code follows a modern decoupled architecture ensuring scalability, speed, and maintainability.

Next.js (Frontend) → Node.js + Express (Backend) → MongoDB (Database)


Frontend: Next.js app (Server-Side Rendering for fast, SEO-friendly pages)

Backend: Node.js with Express — handles API requests, authentication, and CRUD operations

Database: MongoDB Atlas — stores user profiles, projects, and stats data

## ⚙️ Tech Stack
Layer	Technology	Description
Frontend	Next.js
	React framework with SSR for performance and SEO
Backend	Node.js
 + Express.js
	REST API for profiles, authentication & data integration
Database	MongoDB Atlas
	Flexible, scalable document-based database
Authentication	JWT
	JSON Web Tokens for secure authentication
Hosting	Frontend: Vercel

Backend: Render

Database: MongoDB Atlas
	
## 🔑 Key Features
Feature	Description
🔐 Auth & Authorization	Custom JWT-based login & registration system for secure API access
🧾 CRUD Operations	Create, read, update, and delete personal profiles and showcased projects
🧭 Frontend Routing	Seamless navigation with routes like /home, /username
🌐 Profile Aggregation	Connect to platforms like GitHub, LeetCode, and Codeforces to display real-time stats
📚 CP Sheet Management	Browse CP problems with search, filter, sort, and pagination by topic or difficulty
⚡ Responsive UI	Modern, responsive interface built for both desktop and mobile
📡 API Overview
Endpoint	Method	Description	Access
/api/auth/register	POST	Register a new user	Public
/api/auth/login	POST	Authenticate and return a JWT	Public
/api/profiles/:username	GET	Fetch a user’s public profile data	Public
/api/profile	PUT	Update user profile (requires JWT)	Private
/api/cp-sheets	GET	Get all CP sheets with filters, sorting, and pagination	Public
🧠 Example API Usage

Filter by Topic (e.g. Dynamic Programming):

GET /api/cp-sheets?topic=dp


Search by Problem Name:

GET /api/cp-sheets?search=knapsack


Sort by Difficulty:

GET /api/cp-sheets?sort=difficulty_asc


Paginate Results:

GET /api/cp-sheets?page=1&limit=20

## 🧩 System Workflow

User Registration / Login — via /api/auth/register and /api/auth/login

Profile Aggregation — fetch user data from coding platforms via backend API calls

Portfolio Generation — dynamic profile route like /username displays all coding stats and projects

CRUD Operations — users can manage their own portfolio and problem sheets

## 🚀 Future Enhancements

Integration with AtCoder, HackerRank, and CodeChef

Custom portfolio themes and dark mode

Leaderboard and community rankings

Activity analytics dashboard showing coding trends

## 📂 Project Folder Structure
```
Kudos_To_Code/
│
├── client/                             # Frontend (Next.js)
│   ├── app/                            # Core application files
│   │   ├── context/                    # React Context for global state
│   │   │   └── AuthContext.js
│   │   ├── dashboard/
│   │   │   └── page.jsx
│   │   ├── HeroSectionDemo/
│   │   │   └── page.js
│   │   ├── login/
│   │   │   └── page.jsx
│   │   ├── portfolio/
│   │   │   └── page.js
│   │   ├── signup/
│   │   │   └── page.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   └── utils.js
│   │   ├── layout.js                   # Root layout file
│   │   ├── not-found.js                # 404 Page
│   │   ├── page.js                     # Main entry
│   │   └── globals.css                 # Global CSS styles
│   │
│   ├── components/                     # Reusable UI Components
│   │   ├── blocks/
│   │   │   ├── footer-section.jsx
│   │   │   ├── hero-section-dark.jsx
│   │   ├── ui/
│   │   │   ├── app-sidebar.jsx
│   │   │   ├── chart-area-interactive.jsx
│   │   │   ├── data-table.jsx
│   │   │   ├── login-form.jsx
│   │   │   ├── signup-form.jsx
│   │   │   ├── section-cards.jsx
│   │   │   ├── site-header.jsx
│   │   │   ├── nav-main.jsx
│   │   │   ├── nav-secondary.jsx
│   │   │   ├── nav-projects.jsx
│   │   │   ├── nav-user.jsx
│   │   │   └── team-switcher.jsx
│   │   ├── hooks/
│   │   │   └── use-mobile.js
│   │   └── lib/
│   │       └── utils.js
│   │
│   ├── public/                         # Static assets (images/icons)
│   │   ├── LoginKudos.jpg
│   │   ├── SignupKudos.jpg
│   │   ├── loginMascot.png
│   │   └── logo.jpg
│   │
│   ├── .env                            # Frontend environment variables
│   ├── next.config.mjs                 # Next.js configuration
│   ├── jsconfig.json                   # Path aliases & JS config
│   ├── package.json                    # Frontend dependencies
│   ├── postcss.config.mjs              # PostCSS configuration
│   └── README.md
│
├── server/                             # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                       # MongoDB connection setup
│   ├── controllers/
│   │   └── authController.js           # Handles authentication routes
│   ├── middlewares/
│   │   └── authMiddleware.js           # JWT verification middleware
│   ├── models/
│   │   └── User.js                     # User model (Mongoose)
│   ├── routes/
│   │   └── auth.js                     # Auth route definitions
│   ├── services/
│   │   ├── hashService.js              # Password hashing utilities
│   │   └── jwtService.js               # JWT token generation/validation
│   ├── .env                            # Backend environment variables
│   ├── server.js                       # Express app entry point
│   ├── package.json                    # Backend dependencies
│   └── README.md
│
├── .gitignore
└── README.md                           # Project documentation (root)
```

## 🧑‍💻 Author
Name:- Vikrant Yadav
Role:- Full Stack Developer & Project Lead

Backend Link: https://kudos-to-code.onrender.com/
Frontend Link : https://kudos-to-code.vercel.app/
