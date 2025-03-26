## 🛠️ User Management API

### `POST /api/auth/login`
- **Deskripsi**: Login user
- **Role yang Diizinkan**: Public
- **Request Body**:
  ```json
  {
    "email": "supervisor@example.com",
    "password": "P@ssw0rd!",
  }
- **Response Success**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzdXBlcnZpc29yQGV4YW1wbGUuY29tIiwicm9sZSI6IlNVUEVSVklTT1IiLCJpYXQiOjE3NDI5ODAxNzQsImV4cCI6MTc0Mjk4Mzc3NH0.aFax89zmPoRC11doJxgMJX9z3sZlY-vtituDrhKWNSh",
  }