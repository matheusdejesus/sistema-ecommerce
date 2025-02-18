const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// O productController foi importado, mas não está sendo utilizado neste arquivo

router.post('/register', userController.register); // Rota para registrar um novo usuário
router.post('/login', userController.login);         // Rota para login do usuário
router.put('/update-profile', userController.updateProfile); // Rota para atualizar perfil do usuário

module.exports = router;