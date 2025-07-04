SkillSwap - Frontend
Welcome to the frontend repository for SkillSwap, a platform designed to connect passionate learners and educators for skill exchange. This application provides a dynamic and interactive user experience, built with modern web technologies.

✨ Features
User Authentication & Authorization:

Secure user registration and login.

Role-based access control (Student, Instructor, Admin).

Protected routes ensuring only authorized users can access specific sections.

Session management with JWTs stored in HTTP-only cookies.

Skill Management:

Browse and search for skills.

View detailed skill pages, including instructor information and student reviews.

Instructors can create, edit, and delete their own skills.

Booking System:

Students can book sessions with instructors for specific skills.

Instructors can view, confirm, mark as completed, or cancel their bookings.

Users can view their own booked sessions.

Real-time conflict detection for booking time slots.

Real-time Chat:

Dedicated chat interface for communication between students and instructors for specific bookings.

Uses Socket.IO for instant messaging.

Displays chat history and auto-scrolls to new messages.

Includes basic user profile display within the chat.

User Profiles:

View and update user profiles (name, bio, avatar).

Admin Dashboard:

An administrative dashboard to view overall user, skill, and booking statistics.

Responsive Design: Optimized for various screen sizes (mobile, tablet, desktop) using Tailwind CSS.

Animations: Enhanced user experience with smooth transitions and animations powered by Framer Motion.

Global Notifications: Integrated react-toastify for user feedback.

Redux Toolkit: Centralized state management for predictable data flow.

🚀 Technologies Used
React.js (v19): The core JavaScript library for building user interfaces.

Vite: A fast build tool for modern web projects.

React Router DOM (v6): For declarative routing in React applications.

Redux Toolkit: Official, opinionated, batteries-included toolset for efficient Redux development.

@reduxjs/toolkit

react-redux

Tailwind CSS: A utility-first CSS framework for rapidly building custom designs.

Framer Motion: A production-ready motion library for React.

Socket.IO Client: For real-time, bidirectional, event-based communication.

Axios: Promise-based HTTP client for making API requests.

React Icons (react-icons/fa, lucide-react): Popular icon libraries.

React Toastify: For customizable toast notifications.

Date-fns: A modern JavaScript date utility library.

🛠️ Setup & Installation
Follow these steps to get the SkillSwap frontend running on your local machine.

Prerequisites
Node.js (v18 or higher recommended)

npm (comes with Node.js) or Yarn

Clone the Repository
git clone <your-frontend-repo-url>
cd client # Navigate into the frontend directory

Install Dependencies
npm install
# OR
yarn install

Environment Variables
Create a .env.local file in the client (frontend) directory. This file will store your backend API URL.

VITE_API_URL=http://localhost:5000 
# Replace with your backend's URL. If deployed, use the production URL (e.g., https://your-backend.onrender.com)

Run the Development Server
npm run dev
# OR
yarn dev

The application should now be running at http://localhost:5173 (or another port if 5173 is in use).

📦 Available Scripts
In the project directory, you can run:

npm run dev: Runs the app in development mode. Open http://localhost:5173 to view it in the browser. The page will reload if you make edits.

npm run build: Builds the app for production to the dist folder. It correctly bundles React in production mode and optimizes the build for the best performance.

npm run lint: Runs ESLint to check for code quality issues.

npm run preview: Serves the dist folder locally for a production preview.

📂 Project Structure (Key Directories)
src/: Contains all the source code for the React application.

assets/: Static assets like images.

components/: Reusable UI components (e.g., Header, SkillCard, ChatComponent, PrivateRoute, AdminRoute).

pages/: Top-level components representing different views/pages of the application (e.g., HomePage, LoginForm, AdminDashboard).

redux/: Redux store setup and individual slices (authSlice, skillSlice, chatSlice, etc.).

utils/: Utility functions and Axios instance configuration.

App.jsx: Main application component responsible for routing.

main.jsx: Entry point for the React application.

☁️ Deployment
This frontend is designed to be deployed as a static site.

Vercel / Netlify: Highly recommended for their ease of use, automatic CI/CD, and global CDN.

Connect your Git repository.

Set the build command to npm run build and the output directory to dist.

Configure VITE_API_URL as an environment variable in the deployment platform's settings, pointing to your deployed backend URL.

🤝 Contributing
Feel free to fork this repository and contribute!

📄 License
This project is licensed under the ISC License.
