# 🚀 Kudos to Code — Coding Profile Builder

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-v20%2B-green)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

**Kudos to Code** is a unified platform that aggregates your coding journey—projects, stats, and competitive programming profiles—into one dynamic portfolio. Showcase your achievements, GitHub activity, and competitive programming stats from platforms like LeetCode and Codeforces, all with a single, shareable link.

---

## 🧩 Problem Statement

Developers today have their work scattered across multiple platforms:
- **GitHub** for projects and source code.
- **LeetCode** for data structures and algorithms.
- **Codeforces** for competitive programming contests.

Recruiters and peers often struggle to view a candidate's complete technical capability in one place. **Kudos to Code** solves this by creating a centralized, unified profile builder that brings together all your coding stats, curated problem sheets, and achievements into a sleek, personalized portfolio.

> "One profile. One link. Your entire coding identity."

---

## 🔗 Live Website

👉 https://kudos-to-code.vercel.app/

---

## 🔑 Key Features

- **🔐 Secure Authentication:** Robust JWT-based login and registration system using secure password hashing.
- **🌐 Profile Aggregation:** Connect accounts from GitHub, LeetCode, and Codeforces to display real-time stats.
- **📚 CP Sheet Management:** - Create and manage custom Competitive Programming (CP) sheets.
  - Organize problems by sections/topics.
  - Track progress with visual completion bars.
- **✅ Progress Tracking:** Mark problems as completed, track your daily activity, and visualize your growth.
- **⚡ Modern UI:** Fully responsive dashboard built with **Next.js 16** and **Tailwind CSS v4**.
- **🧭 Dynamic Routing:** User-friendly navigation and dynamic profile pages.

---

## 🏗️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js 16 (App Router)
- **Language:** JavaScript / React 19
- **Styling:** Tailwind CSS v4, Framer Motion (Animations)
- **Components:** Radix UI, Lucide React
- **Data Fetching:** Axios
- **Linting/Formatting:** Biome

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT), BcryptJS
- **Validation:** Mongoose Schemas

---

## 🛠️ Installation & Local Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```
git clone [https://github.com/vikgenix/Kudos_To_Code.git](https://github.com/vikgenix/Kudos_To_Code.git)
cd Kudos_To_Code
```


2. Backend Setup
Navigate to the server directory, install dependencies, and configure the environment.



```
cd server
npm install
```

Create a .env file in the server/ directory:

Code snippet

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:3000
```

Start the backend server:


```
npm run dev
# Server runs on http://localhost:5000
```

3. Frontend Setup
Open a new terminal, navigate to the client directory, and install dependencies.

```
cd client
npm install
```

Create a .env file in the client/ directory:

Code snippet

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:



```
npm run dev
```
Application runs on http://localhost:3000


📡 API Endpoints
The backend exposes a RESTful API. Below are the primary endpoints:
Authentication
Method
Endpoint
Description
POST
/api/auth/register
Register a new user
POST
/api/auth/login
Authenticate and receive JWT

Sheets & Problems
Method
Endpoint
Description
GET
/api/sheets
Get all CP sheets (supports pagination/search)
POST
/api/sheets
Create a new CP sheet
GET
/api/sheets/:id
Get specific sheet details & problems
PUT
/api/sheets/:id
Update sheet details
DELETE
/api/sheets/:id
Delete a sheet
POST
/api/sheets/:sheetId/problems
Add a problem to a sheet
PUT
/api/sheets/problems/:id/toggle
Toggle problem completion status

📂 Folder Structure


```
Kudos_To_Code/
│
├── client/                 # Next.js Frontend
│   ├── app/                # App Router pages and layouts
│   ├── components/         # Reusable UI components
│   ├── services/           # API interaction logic
│   └── public/             # Static assets
│
├── server/                 # Express Backend
│   ├── config/             # DB configuration
│   ├── controllers/        # Request logic
│   ├── middlewares/        # Auth middleware
│   ├── models/             # Mongoose models (User, Sheet, Problem)
│   └── routes/             # API route definitions
│
└── README.md               # Project Documentation
```

## 🚀 Future Enhancements
- Integration with AtCoder and HackerRank APIs.

- Leaderboard system for community rankings.

- Dark Mode toggle (Global).

- Social sharing for completed sheets.

## 🤝 Contributing
Contributions are welcome! Please follow these steps:
- Fork the repository.
- Create a new branch (git checkout -b feature/YourFeature).
- Commit your changes.
- Push to the branch.
- Open a Pull Request.

## 🧑‍💻 Author
Vikrant Yadav
Role: Full Stack Developer & Project Lead
GitHub Profile

## 📄 License
This project is licensed under the ISC License.
