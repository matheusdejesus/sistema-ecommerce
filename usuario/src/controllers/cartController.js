const pool = require('../../../src/database.js');

// Adiciona um item ao carrinho com quantidade default = 1 (retorno na resposta)
exports.addToCart = async (req, res) => {
  try {
    const { id_usuario, id_produto } = req.body;
    if (!id_usuario || !id_produto) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }
    const [existing] = await pool.execute(
      `SELECT * FROM carrinhos WHERE id_usuario = ? AND id_produto = ?`,
      [id_usuario, id_produto]
    );
    if (existing.length > 0) {
      return res.status(200).json({ message: "Produto já está no carrinho", quantidade: 1 });
    } else {
      const [result] = await pool.execute(
        `INSERT INTO carrinhos (id_usuario, id_produto) VALUES (?, ?)`,
        [id_usuario, id_produto]
      );
      return res.status(201).json({ message: "Produto adicionado ao carrinho", cartId: result.insertId, quantidade: 1 });
    }
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    res.status(500).json({ message: "Erro ao adicionar produto ao carrinho", error: err.message });
  }
};


// Remove um item do carrinho
exports.removeFromCart = async (req, res) => {
  try {
    const { id_usuario, id_produto } = req.body;
    if (!id_usuario || !id_produto) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }
    const [result] = await pool.execute(
      `DELETE FROM carrinhos WHERE id_usuario = ? AND id_produto = ?`,
      [id_usuario, id_produto]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item não encontrado no carrinho" });
    res.status(200).json({ message: "Produto removido do carrinho" });
  } catch (err) {
    console.error("Erro ao remover do carrinho:", err);
    res.status(500).json({ message: "Erro ao remover produto do carrinho", error: err.message });
  }
};
