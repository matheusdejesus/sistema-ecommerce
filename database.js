const { Pool } = require('pg');

// Configuração da conexão com o Postgres
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_ecommerce',
  password: 'matheus10',
  port: 5432,
});

// Função para executar queries
const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    throw error;
  }
};

// Testar a conexão ao iniciar
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    client.release();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

// Exportar todas as funções e o pool
module.exports = {
  query,
  testConnection,
  pool
};