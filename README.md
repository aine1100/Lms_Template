# Library Management System (LMS)

A comprehensive **Library Management System** built with modern web technologies, featuring role-based portals for Librarians and Students, complete book inventory management, and automated lending workflows.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 📖 Overview

The Library Management System is a full-stack web application designed to streamline library operations. It provides:

- **Librarian Portal**: Manage books, issue/return books, track overdue items, and view analytics
- **Student Portal**: Browse library catalog, view borrowed books with due dates, and manage reservations
- **Automated Workflows**: Email notifications for due dates, overdue alerts, and fine calculations
- **Real-time Updates**: WebSocket integration for live notifications
- **Role-Based Access Control**: Secure authentication and authorization

## ✨ Features

### Librarian Features
- 📚 **Book Management**: Add, edit, delete books with complete metadata (ISBN, genre, publisher, quantity)
- 📊 **Dashboard Analytics**: Visual charts showing borrowing trends, popular genres, and inventory status
- 💼 **Lending Console**: Issue and return books with due date management
- 📧 **Email Notifications**: Automated reminders for upcoming due dates and overdue alerts
- 📋 **Transaction History**: Complete audit trail of all lending activities
- 👥 **Student Management**: View student profiles and lending history
- ⚙️ **System Settings**: Configure fine amounts, notification schedules, and lending policies

### Student Features
- 🔍 **Browse Library**: Search and filter books by title, author, genre, and ISBN
- 📖 **My Books**: View all currently borrowed books with:
  - Due dates with countdown timers
  - Color-coded status (On Time, Due Soon, Overdue)
  - Quick return options
- 🔔 **Notifications**: Receive alerts for:
  - Due date reminders
  - Overdue penalties
  - Book availability updates
- ⭐ **Book Reservations**: Reserve books when not available
- ⚙️ **Account Settings**: Update profile information and preferences

### Common Features
- 🔐 **Secure Authentication**: JWT-based authentication with refresh tokens
- 🎨 **Responsive UI**: Mobile-friendly interface using Tailwind CSS
- 🌓 **Modern Design**: Clean, intuitive user interface with smooth animations
- 📱 **Cross-Device Support**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.6 (React 19.2.4)
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Lucide React icons, Framer Motion animations
- **HTTP Client**: Axios with interceptors
- **Data Visualization**: Recharts
- **State Management**: React Hooks
- **Deployment**: Docker, Vercel-ready

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Drizzle ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: SMTP (Gmail-compatible)
- **Real-time**: Socket.io (WebSocket)
- **Validation**: Custom middleware
- **Deployment**: Docker

### Database
- **Type**: PostgreSQL 15
- **Schema Management**: Drizzle migrations
- **Key Tables**: users, books, transactions, notifications, otps, reservations

## 📁 Project Structure

```
lms/
├── backend/                           # Node.js/Express API server
│   ├── src/
│   │   ├── index.js                  # Server entry point
│   │   ├── config/
│   │   │   ├── db.js                 # Database connection
│   │   │   └── swagger.js            # API documentation setup
│   │   ├── controllers/
│   │   │   ├── authController.js     # Authentication logic
│   │   │   ├── bookController.js     # Book management logic
│   │   │   └── userController.js     # User management logic
│   │   ├── models/
│   │   │   └── schema.js             # Database schema definitions
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /auth endpoints
│   │   │   ├── bookRoutes.js         # /books endpoints
│   │   │   └── userRoutes.js         # /users endpoints
│   │   ├── services/
│   │   │   ├── authService.js        # Auth business logic
│   │   │   ├── bookService.js        # Book business logic
│   │   │   └── userService.js        # User business logic
│   │   └── utils/
│   │       ├── authMiddleware.js     # JWT verification & authorization
│   │       ├── email.js              # Email sending service
│   │       └── socket.js             # WebSocket setup
│   ├── drizzle/                       # Database migrations
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── view/                              # Next.js frontend application
│   ├── app/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   ├── login/
│   │   │   └── page.tsx              # Login page
│   │   ├── register/
│   │   │   └── page.tsx              # Registration page
│   │   └── (portals)/
│   │       ├── librarian/            # Librarian portal
│   │       │   ├── layout.tsx
│   │       │   ├── dashboard/
│   │       │   ├── books/
│   │       │   ├── lending/
│   │       │   ├── notifications/
│   │       │   └── settings/
│   │       └── student/              # Student portal
│   │           ├── layout.tsx
│   │           ├── my-books/
│   │           ├── all-books/
│   │           ├── notifications/
│   │           └── settings/
│   ├── components/
│   │   └── shared/
│   │       └── Sidebar.tsx           # Navigation sidebar
│   ├── lib/
│   │   └── api.ts                    # Axios HTTP client setup
│   ├── public/                        # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml                 # Docker Compose orchestration
├── .env.example                       # Environment variables template
├── DOCKER_SETUP.md                    # Docker setup guide
└── README.md                          # This file
```

## 📋 Prerequisites

### Local Development
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **PostgreSQL**: 14.0 or higher
- **Git**: 2.0 or higher

### Docker Setup
- **Docker**: 20.10 or higher
- **Docker Compose**: 1.29 or higher

## 💻 Installation

### Local Development Setup

#### 1. Clone the repository
```bash
git clone <repository-url>
cd lms
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials and secrets
# Important: Change JWT_SECRET and JWT_REFRESH_SECRET

# Run database migrations
npm run db:migrate

# Start the backend server
npm start
```

The backend will start on `http://localhost:5000`

#### 3. Frontend Setup

```bash
cd ../view

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Docker Setup

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed Docker instructions.

**Quick Start with Docker:**
```bash
# Copy environment template
cp .env.example .env

# Update .env with your settings

# Start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## ⚙️ Configuration

### Backend Environment Variables (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lms
DB_USER=postgres
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_REFRESH_SECRET=your-refresh-secret-change-this

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@lms.com

# Server
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🚀 Usage

### First Time Setup

1. **Register as Admin** (if first time):
   - Navigate to `/register`
   - Create account with Librarian role
   - This becomes your admin account

2. **Login**:
   - Visit `/login`
   - Enter credentials
   - Automatically redirected to your portal based on role:
     - Librarians → `/librarian/dashboard`
     - Students → `/student/my-books`

### Librarian Workflow

#### Adding Books
1. Navigate to Books section
2. Click "Add New Book"
3. Fill in:
   - Title, Author, ISBN
   - Genre, Publisher
   - Total Quantity
4. Save

#### Issuing a Book
1. Go to Lending Console
2. Click "Issue Book" tab
3. Search and select student email
4. Search and select book
5. Set due date (duration in days)
6. Click "Confirm Lending"

#### Returning a Book
1. Go to Lending Console
2. Click "Return Book" tab
3. Enter student email
4. Select book from dropdown
5. Click "Confirm Return"
6. System calculates fines if overdue

### Student Workflow

#### Browsing Library
1. Go to "Browse Library" (Student Portal)
2. Search by: Title, Author, ISBN
3. Filter by: Genre
4. Toggle view: Grid or List
5. See availability: Available/Out of Stock/Low Stock

#### Viewing Borrowed Books
1. Go to "My Books"
2. See all currently borrowed books
3. View due dates with color coding:
   - 🟢 Green: Due in 3+ days
   - 🟡 Yellow: Due within 3 days
   - 🔴 Red: Overdue

#### Managing Account
- Settings: Update profile information
- Notifications: View and manage alerts

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student" // or "Librarian"
}

Response: 200 OK
{
  "message": "User registered successfully",
  "userId": "uuid"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "accessToken": "jwt-token",
  "refreshToken": "jwt-token",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

#### Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

### Book Endpoints

#### Get All Books (Paginated)
```http
GET /books?page=1&limit=10
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "books": [
    {
      "id": "uuid",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5",
      "genre": "Fiction",
      "totalQuantity": 5,
      "availableQuantity": 3
    }
  ],
  "total": 100,
  "page": 1,
  "pages": 10
}
```

#### Search Books
```http
GET /books/search?q=gatsby
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "books": [...]
}
```

#### Get Student's Borrowed Books
```http
GET /books/my-borrowed
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "books": [
    {
      "id": "transaction-uuid",
      "bookTitle": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "issueDate": "2026-05-20",
      "dueDate": "2026-06-03",
      "returnDate": null,
      "status": "Borrowed",
      "fineAmount": 0
    }
  ]
}
```

#### Issue Book (Librarian Only)
```http
POST /books/issue
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "userId": "student-uuid",
  "bookId": "book-uuid",
  "dueDate": "2026-06-03"
}

Response: 201 Created
{
  "message": "Book issued successfully",
  "transactionId": "uuid"
}
```

#### Return Book (Librarian Only)
```http
POST /books/return
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "transactionId": "uuid",
  "returnDate": "2026-05-25"
}

Response: 200 OK
{
  "message": "Book returned successfully",
  "fineAmount": 50
}
```

### User Endpoints

#### Get User Profile
```http
GET /users/profile
Authorization: Bearer {accessToken}

Response: 200 OK
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Student",
  "isVerified": true,
  "createdAt": "2026-05-20T10:00:00Z"
}
```

#### Update User Profile
```http
PUT /users/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}

Response: 200 OK
{
  "message": "Profile updated successfully"
}
```

For complete API documentation, run the backend and visit `http://localhost:5000/api-docs` (Swagger UI).

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('Librarian', 'Student') DEFAULT 'Student',
  isVerified BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  genre VARCHAR(100),
  publisher VARCHAR(255),
  totalQuantity INTEGER NOT NULL,
  availableQuantity INTEGER NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  bookId UUID REFERENCES books(id),
  userId UUID REFERENCES users(id),
  issueDate DATE NOT NULL,
  dueDate DATE NOT NULL,
  returnDate DATE,
  status ENUM('Borrowed', 'Returned', 'Overdue') DEFAULT 'Borrowed',
  fineAmount DECIMAL(10, 2) DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  type VARCHAR(50),
  message TEXT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 Authentication & Authorization

### JWT Token Structure

**Access Token** (15-minute expiry)
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "Student",
  "iat": 1685880000,
  "exp": 1685880900
}
```

**Refresh Token** (7-day expiry)
```json
{
  "id": "user-uuid",
  "iat": 1685880000,
  "exp": 1686484800
}
```

### Authorization Levels

| Endpoint | Public | Student | Librarian |
|----------|--------|---------|-----------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /books/search | ✅ | ✅ | ✅ |
| GET /books | ❌ | ✅ | ✅ |
| POST /books | ❌ | ❌ | ✅ |
| PUT /books/:id | ❌ | ❌ | ✅ |
| DELETE /books/:id | ❌ | ❌ | ✅ |
| GET /books/my-borrowed | ❌ | ✅ | ❌ |
| POST /books/issue | ❌ | ❌ | ✅ |
| POST /books/return | ❌ | ❌ | ✅ |

## 🐛 Troubleshooting

### Backend Issues

#### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Ensure PostgreSQL is running: `sudo service postgresql start`
- Check database credentials in `.env`
- Verify database exists: `createdb lms`

#### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`
- Or change PORT in `.env`

#### JWT Token Invalid
**Solution:**
- Ensure JWT_SECRET is set in `.env`
- Clear localStorage in browser and login again
- Check token expiry time

### Frontend Issues

#### API Connection Failed
```
Error: Connect to backend failed
```
**Solution:**
- Verify backend is running on correct port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure CORS is configured on backend

#### Login Not Working
**Solution:**
- Clear browser cache and cookies
- Check browser console for errors
- Verify email and password are correct
- Check backend logs for authentication errors

#### Build Errors
```
npm run build fails
```
**Solution:**
```bash
# Clear next cache
rm -rf .next
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
# Try build again
npm run build
```

### Docker Issues

See [DOCKER_SETUP.md](./DOCKER_SETUP.md#troubleshooting) for Docker-specific troubleshooting.

## 🤝 Contributing

### Getting Started with Development

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes following the code style
4. Commit: `git commit -m 'Add your feature'`
5. Push: `git push origin feature/your-feature`
6. Open Pull Request

### Code Style Guidelines

- **Backend**: Use camelCase for variables, PascalCase for classes
- **Frontend**: Use functional components with hooks, camelCase for files
- **Database**: Use snake_case for column names
- **Comments**: Add comments for complex logic
- **Testing**: Write tests for critical features

### Commit Message Format

```
[type]: Brief description

Detailed explanation if needed

- Bullet points for changes
- Another change
```

**Types**: feat, fix, docs, style, refactor, test, chore

### Pull Request Process

1. Update README.md if adding new features
2. Test thoroughly in local environment
3. Ensure no breaking changes
4. Add description of changes
5. Link related issues

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Development Team**

For questions or support, please contact the development team or open an issue in the repository.

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Last Updated**: May 25, 2026

**Version**: 1.0.0
