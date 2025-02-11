# Ferramentas

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm (Node Package Manager)

# Instalação e Uso

1. Instale o PostgreSQL
2. Crie o banco de dados 'db_ecommerce'
3. Configurar a conexão do banco de dados em database.js:
   - user: 'postgres'
   - host: 'localhost'
   - password: 'sua_senha'
   - database: 'db_ecommerce'
   - port: 5432

4. Clone o repositório: git clone https://github.com/your-username/sistema-ecommerce.git
5. instale as dependências: cd sistema-ecommerce
                            npm install

6. Inicie o servidor: node server.js