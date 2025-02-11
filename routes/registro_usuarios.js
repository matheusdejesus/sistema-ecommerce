const express = require('express');
const router = express.Router();
const db = require('../database');

// Rota para registrar usuário
router.post('/', async (req, res) => {
  try {
    // Log para verificar os dados recebidos
    console.log('Dados recebidos do formulário:', req.body);

    const { nome, email, senha, cpf_cnpj, cep, endereco } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!nome || !email || !senha || !cpf_cnpj) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos obrigatórios devem ser preenchidos'
      });
    }

    const query = `
      INSERT INTO usuarios (nome, email, senha, cpf_cnpj, cep, endereco)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [nome, email, senha, cpf_cnpj, cep, endereco];

    // Log da query e valores
    console.log('Query:', query);
    console.log('Valores:', values);

    const result = await db.query(query, values);

    console.log('Resultado da inserção:', result);

    res.json({
      success: true,
      message: 'Usuário registrado com sucesso!',
      userId: result.rows[0].id
    });
  } catch (error) {
    // Log detalhado do erro
    console.error('Erro completo:', error);

    // Verificar se é um erro de violação de chave única
    if (error.code === '23505') { // código para violação de chave única no PostgreSQL
      return res.status(400).json({
        success: false,
        message: 'Email ou CPF/CNPJ já cadastrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao registrar usuário: ' + error.message
    });
  }
});

module.exports = router;