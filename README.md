# Authentication Frontend

A React TypeScript frontend application for authentication with cookie-based JWT tokens.

## Features

- User signup and signin
- Protected routes
- Automatic token refresh
- Form validation with React Hook Form + Zod
- Responsive design

## Prerequisites

- Node.js 20+
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```bash
VITE_API_URL=http://localhost:8080
```

## Running the app

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview
```

## Docker

```bash
docker build -t auth-frontend .
docker run -p 5173:5173 auth-frontend
```

## Pages

- `/signup` - User registration
- `/signin` - User login
- `/app` - Protected application page (requires authentication)

