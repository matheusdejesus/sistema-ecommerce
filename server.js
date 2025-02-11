const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const registroUsuarios = require('./routes/registro_usuarios');
const registroProdutos = require('./routes/registro_produtos');
const loginRouter = require('./routes/login');


const app = express();

// Middleware para processar JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta raiz
app.use(express.static(__dirname));

// Usar a rota de registro
app.use('/registro_usuarios', registroUsuarios);

// Usar a rota de produtos
app.use('/registro_produtos', registroProdutos);

// Usar a rota de login
app.use('/api/login', loginRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await db.testConnection(); // Agora vai funcionar corretamente
});