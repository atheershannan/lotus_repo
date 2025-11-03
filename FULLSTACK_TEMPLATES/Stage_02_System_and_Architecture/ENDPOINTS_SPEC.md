# 📡 API ENDPOINTS SPECIFICATION

> **⚠️ CRITICAL: This file defines all API contracts. Required before Stages 04 and 08!**

---

## 📋 GENERATION INSTRUCTIONS

**BEFORE creating this file:**
1. Review MVP features from Stage 01
2. List all user actions that need backend support
3. Map each action to an API endpoint

**This file will be used by:**
- Stage 03: To understand data flow
- Stage 04: To plan backend tests
- Stage 08: To implement backend logic

---

## 🔑 TEMPLATE STRUCTURE

### Base Configuration
```markdown
## Base URL
Development: http://localhost:3000/api
Production: https://api.yourdomain.com

## Authentication
Method: Bearer Token
Header: Authorization: Bearer {token}
Refresh Endpoint: POST /api/auth/refresh
```

---

## 📝 ENDPOINT FORMAT

For each endpoint, document:

```markdown
### [METHOD] /api/[resource]/[action]
**Description:** [What this endpoint does]

**Headers:**
- Authorization: Bearer {token} (if protected)
- Content-Type: application/json

**Request Body:**
```json
{
  "field1": "type",
  "field2": "type"
}
```

**Query Parameters:**
- param1: description
- param2: description

**Success Response (200/201):**
```json
{
  "data": {...},
  "message": "string"
}
```

**Error Responses:**
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

**Example Request:**
[curl example or fetch example]
```

---

## 🎯 MVP ENDPOINTS (Example)

### Authentication

#### POST /api/auth/register
**Description:** Create new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here",
  "refreshToken": "refresh-token-here"
}
```

---

#### POST /api/auth/login
**Description:** Authenticate existing user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "user": {...},
  "token": "jwt-token",
  "refreshToken": "refresh-token"
}
```

---

#### POST /api/auth/logout
**Description:** Invalidate user session

**Headers:**
- Authorization: Bearer {token}

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### [Add your endpoints here based on MVP features]

---

## 📊 ENDPOINTS SUMMARY

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login | No |
| POST | /api/auth/logout | Logout | Yes |
| [Add rows for all endpoints] | | | |

**Total Endpoints:** [Count]

---

## ⚠️ IMPORTANT NOTES

1. **No implementation yet** - This is just the specification
2. **Must be complete** before Stage 04 (Backend TDD Planning)
3. **Reference this file** when planning tests in Stage 04
4. **Update this file** if requirements change

---

## ✅ VALIDATION CHECKLIST

Before proceeding:
- [ ] All MVP features have corresponding endpoints
- [ ] Request/response formats defined
- [ ] Error handling documented
- [ ] Authentication requirements specified
- [ ] Query parameters documented

---

**Generated:** [Date]  
**For Use In:** Stages 03, 04, 08  
**Update When:** Requirements change or new features added

