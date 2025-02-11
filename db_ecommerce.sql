
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(11) NOT NULL UNIQUE,
    cep VARCHAR(10),
    endereco VARCHAR(255),

ALTER TABLE usuarios RENAME COLUMN usuario_id TO id;
select * from usuarios;
ALTER TABLE usuarios DROP COLUMN sobrenome;

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE produtos (
    id_produto SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    preco NUMERIC(10, 2) NOT NULL,
    quantidade_estoque INT NOT NULL,
    url_imagem VARCHAR(255),
    id_categoria INT,
    CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
);

DROP TABLE IF EXISTS carrinhos;
CREATE TABLE carrinhos (
    id_carrinho SERIAL PRIMARY KEY,
    id_usuario INT,
    id_produto INT,
    CONSTRAINT fk_usuario_carrinho FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    CONSTRAINT fk_produto_carrinho FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT,
    valor_total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('PENDENTE', 'CONCLUIDO', 'CANCELADO')) DEFAULT 'PENDENTE',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_pedido FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE itens_pedido (
    id_item_pedido SERIAL PRIMARY KEY,
    id_pedido INT,
    id_produto INT,
    quantidade INT NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    CONSTRAINT fk_pedido_item FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
    CONSTRAINT fk_produto_item FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);

CREATE TABLE pagamentos (
    id_pagamento SERIAL PRIMARY KEY,
    id_pedido INT,
    valor NUMERIC(10, 2) NOT NULL,
    metodo_pagamento VARCHAR(30) CHECK (metodo_pagamento IN ('CARTAO_CREDITO', 'CARTAO_DEBITO', 'PAYPAL', 'TRANSFERENCIA_BANCARIA')) NOT NULL,
    status_pagamento VARCHAR(20) CHECK (status_pagamento IN ('PENDENTE', 'SUCESSO', 'FALHA')) DEFAULT 'PENDENTE',
    criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pedido_pagamento FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
);
