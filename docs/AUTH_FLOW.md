### auth flow
Client->>Server: POST /api/login
Server->>Database: Find user by email
Database-->>Server: User data
Server->>bcryptjs: Compare passwords
Server->>jsonwebtoken: Generate JWT
Server-->>Client: Return JWT