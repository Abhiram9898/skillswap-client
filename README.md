# 🎓 SkillSwap – Frontend

![🎓 SkillSwap – Frontend - visual selection](https://github.com/user-attachments/assets/51599a83-31d6-4b5d-8ca7-afedde6237c2)



Welcome to the **SkillSwap** frontend repository – a modern, responsive web application built to **connect passionate learners and educators** through skill exchange. This React-based client offers a seamless and interactive user experience using cutting-edge technologies and best practices.

---

## ✨ Features

### 🔐 User Authentication & Authorization
- Secure user registration and login.
- Role-based access control (Student, Instructor, Admin).
- Protected routes for authorized access only.
- JWT-based session management with HTTP-only cookies.

### 🎯 Skill Management
- Browse, search, and view detailed skill listings.
- Instructors can add, update, or delete their own skills.
- Student reviews and instructor profiles included.

### 📅 Booking System
- Students can book sessions for desired skills.
- Instructors can confirm, complete, or cancel bookings.
- Personal booking dashboards for both roles.
- Real-time slot conflict detection.

### 💬 Real-time Chat
- Dedicated chat interface for booked sessions.
- Real-time messaging using **Socket.IO**.
- Chat history, auto-scroll, and profile previews.

### 🙍‍♂️ User Profiles
- View and update profile info (name, bio, avatar).

### 🛠️ Admin Dashboard
- Visual overview of users, bookings, and skill stats.
- Role management and data moderation tools.

### 💡 UX Enhancements
- Fully responsive design via **Tailwind CSS**.
- Smooth animations with **Framer Motion**.
- Toast notifications with **React Toastify**.
- Centralized state using **Redux Toolkit**.

---

## 🚀 Technologies Used

| Category              | Technologies                                                                 |
|-----------------------|------------------------------------------------------------------------------|
| **Frontend Framework**| `React.js (v19)`, `Vite`, `React Router DOM (v6)`                            |
| **State Management**  | `Redux Toolkit`, `@reduxjs/toolkit`, `react-redux`                          |
| **Styling**           | `Tailwind CSS`, `Framer Motion`                                              |
| **Networking**        | `Axios`                                                                      |
| **Real-time**         | `Socket.IO Client`                                                           |
| **Icons & UI**        | `react-icons/fa`, `lucide-react`, `React Toastify`                          |
| **Utilities**         | `date-fns`                                                                   |

---

## 🛠️ Setup & Installation

### ✅ Prerequisites
- **Node.js v18+**
- **npm** or **Yarn**

### 📥 Clone the Repository
```bash
git clone <your-frontend-repo-url>
cd client
📦 Install Dependencies
bash
Copy
Edit
npm install
# OR
yarn install
⚙️ Environment Variables
Create a .env.local file in the client/ directory:

env
Copy
Edit
VITE_API_URL=http://localhost:5000
# Replace with your deployed backend URL if applicable
▶️ Start Development Server
bash
Copy
Edit
npm run dev
# OR
yarn dev
Access the app at: http://localhost:5173

📜 Available Scripts
Script	Description
npm run dev	Runs the app in development mode.
npm run build	Builds the app for production in the dist/ folder.
npm run lint	Checks code for ESLint issues.
npm run preview	Serves the built app locally for previewing.

📁 Project Structure
bash
Copy
Edit
client/
│
├── src/
│   ├── assets/         # Static images and icons
│   ├── components/     # Reusable components (Header, ChatComponent, etc.)
│   ├── pages/          # Page-level components (HomePage, LoginForm, etc.)
│   ├── redux/          # Redux store and slices (authSlice, skillSlice, etc.)
│   ├── utils/          # Axios setup and helper functions
│   ├── App.jsx         # Main application routes
│   └── main.jsx        # Entry point of the app
│
└── .env.local          # Environment configuration
