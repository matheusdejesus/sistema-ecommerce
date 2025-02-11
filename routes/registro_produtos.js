const express = require('express');
const router = express.Router();
const db = require('../database');

// Rota para registrar produto
router.post('/', async (req, res) => {
    const { categoria, titulo, descricao, fotos, valor, quantidade } = req.body;

    const query = `
        INSERT INTO produtos (categoria, titulo, descricao, fotos, valor, quantidade)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    `;

    const values = [categoria, titulo, descricao, fotos, valor, quantidade];

    try {
        const result = await db.query(query, values);
        res.json({
            success: true,
            message: 'Produto cadastrado com sucesso!',
            productId: result.rows[0].id
        });
    } catch (error) {
        console.error('Erro ao cadastrar produto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao cadastrar produto',
            error: error.message
        });
    }
});

module.exports = router; 