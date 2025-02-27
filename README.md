# Ferramentas

- Node.js (v14 ou +)
- MySQL
- npm (Node Package Manager)

# Instalação e Uso

1. Instale o Node.js e o MySQL
2. Crie o banco de dados 'db_ecommerce'
3. Clone o repositório: git clone https://github.com/matheusdejesus/sistema-ecommerce.git
4. Certifique-se de ter configurado corretamente o arquivo .env com as informações de conexão ao banco de dados e das chaves Stripe.

   DB_HOST=localhost

   DB_USER=root

   DB_PASSWORD='sua_senha'

   DB_NAME='nome_do_banco'

   PORT=3000

   STRIPE_SECRET_KEY=

   STRIPE_PUBLIC_KEY=

   BASE_URL=http://localhost:3000
6. Instale as dependências no diretório: npm install
7. Inicie o servidor: npm start
