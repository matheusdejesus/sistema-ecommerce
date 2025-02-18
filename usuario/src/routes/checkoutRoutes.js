const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
    try {
        const { items } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Itens inválidos" });
        }
        // Cria a sessão de checkout com Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: items,
            success_url: `${process.env.BASE_URL}/usuario/pconcluido.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/usuario/pcancelado.html`
        });
        return res.status(200).json({ id: session.id });
    } catch (error) {
        console.error("Erro ao criar sessão:", error);
        return res.status(500).json({ error: error.message });
    }
});
module.exports = router;