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

// Controller para buscar todos os produtos
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await pool.execute(`
            SELECT p.*, c.nome as categoria_nome 
            FROM produtos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        `);
        res.json(products);
    } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        res.status(500).json({ message: "Erro ao buscar produtos" });
    }
};