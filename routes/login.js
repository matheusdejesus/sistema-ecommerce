const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/', async (req, res) => {
    try {
        console.log('Requisição de login recebida:', req.body);

        const { email, senha } = req.body;

        // Verificar se email e senha foram fornecidos
        if (!email || !senha) {
            console.log('Email ou senha não fornecidos');
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        const query = 'SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2';
        console.log('Executando query:', query);
        console.log('Valores:', [email, senha]);

        const result = await db.query(query, [email, senha]);
        console.log('Resultado da query:', result.rows);

        if (result.rows.length > 0) {
            console.log('Login bem-sucedido para:', result.rows[0].email);
            res.json({
                success: true,
                message: 'Login realizado com sucesso!',
                nome: result.rows[0].nome,
                email: result.rows[0].email
            });
        } else {
            console.log('Usuário não encontrado ou senha incorreta');
            res.status(401).json({
                success: false,
                message: 'Email ou senha incorretos'
            });
        }
    } catch (error) {
        console.error('Erro detalhado no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login: ' + error.message
        });
    }
});

module.exports = router; 