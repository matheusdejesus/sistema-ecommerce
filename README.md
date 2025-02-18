# Pré-requisitos

- Node.js (v14 ou +)
- MySQL
- npm (Node Package Manager)

# Instalação e Uso

<h3>1. Clonar o Repositório:</h3> 
git clone https://github.com/matheusdejesus/sistema-ecommerce.git

 <h3>2. Configurar o Banco de Dados</h3>
   
   Crie um banco de dados chamado db_ecommerce no MySQL.

   Importe o script SQL localizado em db_ecommerce.sql para criar as tabelas necessárias.
     <h3>3. Configurar as Variáveis de Ambiente</h3>

     Ajuste o arquivo .env com as seguintes configurações:

     DB_HOST=localhost

     DB_USER=root

     DB_PASSWORD='matheus10$'

     DB_NAME=db_ecommerce

     PORT=3000

     STRIPE_SECRET_KEY=sk_test_...

     STRIPE_PUBLIC_KEY=pk_test_...

   <h3>4. Instalar as Dependências:</h3>
   npm install
   <h3>5. Executar o Projeto:</h3>
   npm start
