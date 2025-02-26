const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../../../src/database');

// Rota create para incluir os itens do pedido
router.get('/create', async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.status(400).json({ error: 'Session ID não fornecido' });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        const userId = session.metadata.userId;
        const total = session.amount_total / 100;
        const items = JSON.parse(session.metadata.items);

        // Inicia uma transação
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Insere o pedido
            const [orderResult] = await connection.execute(
                `INSERT INTO pedidos (id_usuario, valor_total, status) VALUES (?, ?, 'CONCLUIDO')`,
                [userId, total]
            );

            // Insere os itens do pedido
            const orderId = orderResult.insertId;
            for (const item of items) {
                await connection.execute(
                    `INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, preco) 
                     VALUES (?, ?, ?, ?)`,
                    [orderId, item.id_produto, item.quantity, item.unit_amount / 100]
                );
            }

            await connection.commit();
            return res.status(200).json({
                message: 'Pedido registrado com sucesso',
                orderId: orderId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Erro ao registrar pedido:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Rota GET para buscar os pedidos
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ error: 'ID do usuário não fornecido' });
        }

        const [orders] = await pool.execute(`
            SELECT p.*, DATE_FORMAT(p.criacao, '%d/%m/%Y %H:%i') as date,
                   GROUP_CONCAT(pr.nome) as product_names,
                   GROUP_CONCAT(ip.quantidade) as quantities,
                   GROUP_CONCAT(ip.preco) as prices
            FROM pedidos p
            LEFT JOIN itens_pedido ip ON p.id_pedido = ip.id_pedido
            LEFT JOIN produtos pr ON ip.id_produto = pr.id_produto
            WHERE p.id_usuario = ?
            GROUP BY p.id_pedido
            ORDER BY p.criacao DESC
        `, [userId]);

        const formattedOrders = orders.map(order => ({
            id: order.id_pedido,
            date: order.date,
            status: order.status,
            total: parseFloat(order.valor_total),
            items: order.product_names ? order.product_names.split(',').map((name, index) => ({
                productName: name,
                quantity: parseInt(order.quantities.split(',')[index]),
                price: parseFloat(order.prices.split(',')[index])
            })) : []
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.body;

        // Verifica se o pedido pertence ao usuário
        const [order] = await pool.execute(
            'SELECT id_pedido FROM pedidos WHERE id_pedido = ? AND id_usuario = ?',
            [orderId, userId]
        );

        if (order.length === 0) {
            return res.status(404).json({
                message: 'Pedido não encontrado ou não pertence ao usuário'
            });
        }

        // Deleta o pedido do banco de dados
        const [result] = await pool.execute(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [orderId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        res.status(200).json({ message: 'Pedido cancelado com sucesso' });
    } catch (error) {
        console.error('Erro ao cancelar pedido:', error);
        res.status(500).json({ message: 'Erro ao cancelar pedido', error: error.message });
    }
});

module.exports = router;