const AuthService = require('../../services/AuthService');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // Validasi input
        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: 'Email dan password wajib diisi'
          });
        }
    
        // Panggil service auth
        const result = await AuthService.login(email, password);
        
        // Response
        res.json({
          success: true,
          token: result.token,
        //   role: result.user.role,
        //   id: result.user.id
        });
        
      } catch (error) {
        console.error('Login error:', error.message);
        
        // Handle error
        const statusCode = error.message.includes('credentials') ? 401 : 500;
        const errorMessage = statusCode === 401 
          ? 'Email atau password salah' 
          : 'Terjadi kesalahan pada server';
    
        res.status(statusCode).json({
          success: false,
          message: errorMessage
        });
      }
  }; 

module.exports = { login };