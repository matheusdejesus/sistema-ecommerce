require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userRoutes = require('../admin/src/routes/userRoutes');
const productRoutes = require('../admin/src/routes/productRoutes');
const checkoutRoutes = require('../usuario/src/routes/checkoutRoutes');
const cartRoutes = require('../usuario/src/routes/cartRoutes');
const orderRoutes = require('../usuario/src/routes/orderRoutes');
const pool = require('./database');
const app = express();

app.use(cors());
app.use(express.json());

// Sirva os arquivos estáticos adequados
app.use('/admin', express.static(path.join(__dirname, '../admin/public')));
app.use('/usuario', express.static(path.join(__dirname, '../usuario/public')));
app.use('/uploads', express.static(path.join(__dirname, '../admin/public/uploads')));

// Monte as rotas da API
app.use('/api/users', userRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Endpoint de webhook
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const total = session.amount_total / 100;
        try {
            const [result] = await pool.execute(
                
                `INSERT INTO pedidos (id_usuario, valor_total, status) VALUES (?, ?, 'CONCLUIDO')`,
                [userId, total]
            );
            // Registre também os itens do pedido...
            console.log(`Pedido ${result.insertId} registrado com sucesso`);
        } catch (error) {
            console.error('Erro ao registrar pedido:', error);
        }
    }
    res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});