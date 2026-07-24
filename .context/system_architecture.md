# System Architecture — Portfolio MERN

## Stack
- Frontend: React (Vite) + Tailwind CSS + React Router + Axios
- Backend: Node.js + Express
- Database: MongoDB (Mongoose ODM)
- Auth: JWT (stored in httpOnly cookie)
- Image hosting: Cloudinary (later)
- Deployment: Frontend → Vercel, Backend → Render, DB → MongoDB Atlas

## Folder Structure
portfolio-mern/
├── backend/
│   ├── config/        # db.js, cloudinary.js
│   ├── models/         # User.js, Project.js, Message.js
│   ├── controllers/    # projectController.js, authController.js
│   ├── routes/         # projectRoutes.js, authRoutes.js
│   ├── middleware/     # auth.js, errorHandler.js
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/     # AuthContext.jsx
│   │   ├── api/         # axios instance
│   │   └── App.jsx

## Data Models (planned)
- User: name, email, password (hashed), role
- Project: title, description, techStack[], image, github, live, featured
- Message: name, email, message, createdAt

## Auth Flow
Admin logs in → JWT issued → stored in httpOnly cookie → protected routes check middleware