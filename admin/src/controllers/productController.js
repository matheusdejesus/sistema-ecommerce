const pool = require('../../../src/database.js');

// Controller para adicionar um novo produto
exports.addProduct = async (req, res) => {
    try {
        const { id_categoria, nome, descricao, quantidade_estoque, preco, id_usuario } = req.body;
        if (!id_usuario) return res.status(400).json({ message: "Usuário não identificado" });
        const uploadedFiles = req.files || [];
        const imageNames = uploadedFiles.map(file => file.filename);
        const url_imagem = imageNames.length > 0 ? imageNames.join(',') : null;
        const [result] = await pool.execute(
            `INSERT INTO produtos (
                id_categoria, 
                nome, 
                descricao, 
                quantidade_estoque, 
                preco, 
                url_imagem,
                id_usuario
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_categoria, nome, descricao, quantidade_estoque, preco, url_imagem, id_usuario]
        );
        res.status(201).json({ message: "Produto adicionado com sucesso", productId: result.insertId });
    } catch (err) {
        console.error("Erro ao adicionar produto:", err);
        res.status(500).json({ message: "Erro ao adicionar produto", error: err.message });
    }
};

// Controller para listar produtos, opcionalmente filtrando por id_usuario
exports.getProducts = async (req, res) => {
    try {
        const userId = req.query.userId;
        let query, params;
        if (!userId) {
            query = `
                SELECT p.*, c.nome as categoria_nome 
                FROM produtos p 
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
            `;
            params = [];
        } else {
            query = `
                SELECT p.*, c.nome as categoria_nome 
                FROM produtos p 
                LEFT JOIN categorias c ON p.id_categoria = c.id_categoria 
                WHERE p.id_usuario = ?
            `;
            params = [userId];
        }
        const [products] = await pool.execute(query, params);
        res.status(200).json(products);
    } catch (err) {
        console.error("Erro ao listar produtos:", err);
        res.status(500).json({ message: "Erro ao listar produtos", error: err.message });
    }
};

// Controller para remover um produto
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute('DELETE FROM produtos WHERE id_produto = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Produto não encontrado" });
        res.status(200).json({ message: "Produto removido com sucesso" });
    } catch (err) {
        console.error("Erro ao remover produto:", err);
        res.status(500).json({ message: "Erro ao remover produto", error: err.message });
    }
};

// Controller para buscar detalhes de um produto específico
exports.getProduct = async (req, res) => {
    try {
        const [product] = await pool.execute('SELECT * FROM produtos WHERE id_produto = ?', [req.params.id]);
        if (product.length === 0) return res.status(404).json({ message: "Produto não encontrado" });
        res.json(product[0]);
    } catch (err) {
        console.error("Erro ao buscar produto:", err);
        res.status(500).json({ message: "Erro ao buscar produto", error: err.message });
    }
};

// Controller para atualizar um produto existente
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_categoria, nome, descricao, quantidade_estoque, preco } = req.body;
        let updateQuery = `
            UPDATE produtos 
            SET id_categoria = ?, 
                nome = ?, 
                descricao = ?, 
                quantidade_estoque = ?, 
                preco = ?
        `;
        let params = [id_categoria, nome, descricao, quantidade_estoque, preco];

        if (req.files && req.files.length > 0) {
            const imageNames = req.files.map(file => file.filename).join(',');
            updateQuery += `, url_imagem = ?`;
            params.push(imageNames);
        }
        updateQuery += ` WHERE id_produto = ?`;
        params.push(id);
        const [result] = await pool.execute(updateQuery, params);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Produto não encontrado" });
        res.json({ message: "Produto atualizado com sucesso" });
    } catch (err) {
        console.error("Erro ao atualizar produto:", err);
        res.status(500).json({ message: "Erro ao atualizar produto", error: err.message });
    }
};