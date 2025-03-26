### JWT Configuration
- Secret key diambil dari environment variable (`JWT_SECRET`).
- Token expiry: (default sistem/belum disesuaikan)

### Role Enforcement
- Gunakan middleware `roleMiddleware` di semua endpoint sensitif:
  ```javascript
  router.get('/admin', authMiddleware, roleMiddleware('supervisor'), adminController);

## Instalasi package
- (npm install bcryptjs jsonwebtoken dotenv mysql2)

## configurasi .env
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1h
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=auth_db

## 📚 Referensi
- [OpenAPI Specification](https://swagger.io/specification/)
- [JWT Best Practices](https://curity.io/resources/learn/jwt-best-practices)