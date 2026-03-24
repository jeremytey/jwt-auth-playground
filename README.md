# JWT Auth Playground

A minimal full-stack app built to deeply understand JWT authentication — 
access tokens, refresh token rotation, httpOnly cookies, and role-based 
route protection.

## Tech Stack
**Backend:** Node.js, Express, bcrypt, jsonwebtoken, cookie-parser, uuid  
**Frontend:** React, Axios, Zustand

## Auth Flow
- Access token — short-lived (15min), sent via Authorization header
- Refresh token — long-lived (7d), stored in httpOnly cookie
- Rotation — refresh token consumed on use, new one issued
- Family tracking — reused token invalidates entire session family

## Endpoints
| Method | Route | Auth |
|--------|-------|------|
| POST | /auth/register | None |
| POST | /auth/login | None |
| POST | /auth/refresh | httpOnly cookie |
| POST | /auth/logout | httpOnly cookie |
| GET | /public | None |
| GET | /protected | Access token |
| GET | /admin | Access token + ADMIN role |

## Setup
```bash
# Backend
cd backend && npm install && node server.js

# Frontend
cd frontend && npm install && npm run dev
```

Add a `.env` file in `/backend`:
```
JWT_ACCESS_KEY=your_access_secret
JWT_REFRESH_KEY=your_refresh_secret
PORT=3000
```