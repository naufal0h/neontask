# 🔮 NeonTask

> Cyberpunk-themed Task Management System

![NeonTask](https://img.shields.io/badge/NeonTask-v1.0.4-cyan?style=for-the-badge)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Node%20%2B%20Prisma%20%2B%20PostgreSQL-purple?style=for-the-badge)

A full-stack task management application with a cyberpunk aesthetic, featuring JWT authentication, CRUD operations, and real-time status tracking.

![System Status](https://img.shields.io/badge/system-ONLINE-green?style=flat-square)
![Database](https://img.shields.io/badge/database-CONNECTED-blue?style=flat-square)

---

## ✨ Features

- 🔐 **JWT Authentication** - Secure login/register with bcrypt password hashing
- 📝 **Task CRUD** - Create, read, update, delete operations
- 🏷️ **Priority Levels** - LOW | MEDIUM | HIGH | CRITICAL
- 🔄 **Status Tracking** - STANDBY | IN_PROGRESS | EXECUTED
- 🎨 **Cyberpunk UI** - Neon cyan/magenta theme with scanline effects
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast Performance** - Vite + React + Express

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js + Express
- **Database:** PostgreSQL
- **ORM:** Prisma 6
- **Auth:** JWT + bcryptjs
- **Language:** TypeScript

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **State:** Zustand
- **Icons:** Lucide React
- **HTTP Client:** Axios

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- pnpm (or npm/yarn)

### 1. Clone & Install

```bash
git clone https://github.com/naufal0h/neontask.git
cd neontask

# Install backend dependencies
pnpm install

# Install frontend dependencies
cd client
pnpm install
cd ..
2. Environment Setup
Create .env in root directory:
3. Database Setup
bash

# Generate Prisma client
pnpm exec prisma generate

# Run migrations
pnpm exec prisma migrate dev --name init
4. Run Development
bash

# Terminal 1 - Backend
pnpm dev

# Terminal 2 - Frontend
cd client
pnpm dev
Backend: http://localhost:3001
Frontend: http://localhost:5173
📡 API Endpoints
Table

Method	Endpoint	Description	Auth
GET	/api/health	System status	No
POST	/api/auth/register	Create account	No
POST	/api/auth/login	Login	No
GET	/api/tasks	List all tasks	Yes
POST	/api/tasks	Create task	Yes
PUT	/api/tasks/:id	Update task	Yes
DELETE	/api/tasks/:id	Delete task	Yes
🗄️ Database Schema
prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  handle    String   @unique
  tasks     Task[]
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String?
  priority    Priority @default(LOW)
  status      Status   @default(STANDBY)
  dueDate     DateTime?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
🎨 Cyberpunk Theme

Table
Color	Hex	Usage
Void Black	#0a0a0f	Background
Neon Cyan	#00f0ff	Primary accent
Neon Magenta	#ff00a0	Critical alerts
Neon Green	#39ff14	Success states
Neon Yellow	#f0e100	Warnings


📁 Project Structure
neontask/
├── src/                    # Backend
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth middleware
│   ├── routes/             # API routes
│   ├── utils/              # JWT & bcrypt
│   └── server.ts           # Entry point
├── client/                 # Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Login & Operations
│   │   ├── store/          # Zustand stores
│   │   └── api/            # Axios config
│   └── index.html
├── prisma/
│   └── schema.prisma       # Database schema
└── package.json


🔒 Security
Passwords hashed with bcrypt (10 rounds)
JWT tokens expire in 7 days
Protected routes verify token validity
Users can only access their own tasks
🧪 Testing
bash


# Run backend tests
pnpm test

# API testing with curl
curl http://localhost:3001/api/health
🚧 Roadmap
[ ] Pagination for large task lists
[ ] Real-time updates (Socket.io)
[ ] File attachments
[ ] Email notifications
[ ] Mobile PWA
[ ] Dark/Light mode toggle
📜 License
MIT License - feel free to hack and modify.
🙏 Credits
Built with the Prisma + PostgreSQL + React stack.
Cyberpunk aesthetic inspired by neon-noir interfaces.