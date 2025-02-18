const pool = require('../db/database');

// Adiciona ou atualiza um item no carrinho
exports.addToCart = async (req, res) => {
  try {
    const { id_usuario, id_produto, quantidade } = req.body;
    if (!id_usuario || !id_produto || !quantidade) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }
    const [existing] = await pool.execute(
      `SELECT * FROM carrinhos WHERE id_usuario = ? AND id_produto = ?`,
      [id_usuario, id_produto]
    );
    if (existing.length > 0) {
      const newQuantity = existing[0].quantidade + quantidade;
      await pool.execute(
        `UPDATE carrinhos SET quantidade = ? WHERE id_carrinho = ?`,
        [newQuantity, existing[0].id_carrinho]
      );
      return res.status(200).json({ message: "Quantidade atualizada no carrinho" });
    } else {
      const [result] = await pool.execute(
        `INSERT INTO carrinhos (id_usuario, id_produto, quantidade) VALUES (?, ?, ?)`,
        [id_usuario, id_produto, quantidade]
      );
      return res.status(201).json({ message: "Produto adicionado ao carrinho", cartId: result.insertId });
    }
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    res.status(500).json({ message: "Erro ao adicionar produto ao carrinho", error: err.message });
  }
};

// Retorna os itens do carrinho para um usuário
exports.getCartItems = async (req, res) => {
  try {
    const { id_usuario } = req.query;
    if (!id_usuario) {
      return res.status(400).json({ message: "Usuário não informado" });
    }
    const [cartItems] = await pool.execute(
      `SELECT c.quantidade, p.* 
       FROM carrinhos c 
       JOIN produtos p ON c.id_produto = p.id_produto 
       WHERE c.id_usuario = ?`,
      [id_usuario]
    );
    res.status(200).json(cartItems);
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    res.status(500).json({ message: "Erro ao buscar carrinho", error: err.message });
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

// Atualiza a quantidade de um item no carrinho
exports.updateCartQuantity = async (req, res) => {
  try {
    const { id_usuario, id_produto, quantidade } = req.body;
    if (!id_usuario || !id_produto || quantidade == null) {
      return res.status(400).json({ message: "Campos obrigatórios faltando" });
    }
    const [result] = await pool.execute(
      `UPDATE carrinhos SET quantidade = ? WHERE id_usuario = ? AND id_produto = ?`,
      [quantidade, id_usuario, id_produto]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Item não encontrado no carrinho" });
    res.status(200).json({ message: "Quantidade atualizada" });
  } catch (err) {
    console.error("Erro ao atualizar carrinho:", err);
    res.status(500).json({ message: "Erro ao atualizar carrinho", error: err.message });
  }
};