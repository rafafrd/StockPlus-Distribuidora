CREATE DATABASE StockPlus_db;

USE StockPlus_db;

CREATE TABLE IF NOT EXISTS Categorias (
    id_categoria INT PRIMARY KEY AUTO_INCREMENT,
    dc_categoria TEXT
);

CREATE TABLE IF NOT EXISTS Fornecedores (
    id_fornecedor INT PRIMARY KEY AUTO_INCREMENT,
    dc_fornecedor TEXT
);

CREATE TABLE IF NOT EXISTS Produtos (
    id_produto INT PRIMARY KEY AUTO_INCREMENT,
    dc_produto TEXT,
    vinculo_imagem VARCHAR(100) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    estoque_minimo INT NOT NULL,
    id_categoria INT NOT NULL,
    id_fornecedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria),
    FOREIGN KEY (id_fornecedor) REFERENCES fornecedores (id_fornecedor)
);

CREATE TABLE IF NOT EXISTS Estoque (
    id_estoque INT PRIMARY KEY AUTO_INCREMENT,
    id_produto INT NOT NULL,
    quantidade_atual INT NOT NULL,
    dt_ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);

CREATE TABLE IF NOT EXISTS Lote_Estoque (
    id_lote INT PRIMARY KEY AUTO_INCREMENT,
    id_produto INT NOT NULL,
    dt_vencimento DATE,
    quantidade_lote INT,
    dt_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);

CREATE TABLE IF NOT EXISTS Movimentacao (
    id_movimentacao INT PRIMARY KEY AUTO_INCREMENT,
    tipo_movimento ENUM('ENTRADA', 'SAIDA') NOT NULL,
    quantidade INT NOT NULL,
    dt_movimentacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_lote INT,
    id_produto INT,
    FOREIGN KEY (id_lote) REFERENCES Lote_Estoque (id_lote),
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);