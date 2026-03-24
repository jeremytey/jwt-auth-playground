const { Router } = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const authRouter = Router();

authRouter.post('/auth/register', authController.register);
authRouter.post('/auth/login', authController.login);
authRouter.post('/auth/refresh', authController.refresh);
authRouter.post('/auth/logout', authController.logout);
authRouter.get('/public',authController.getPublic);
authRouter.get('/protected', authMiddleware.verifyToken, authController.getProtected);
authRouter.get('/admin', authMiddleware.verifyToken, authMiddleware.requireRole('ADMIN'), authController.getAdmin);

module.exports = authRouter;