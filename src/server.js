require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userRoutes = require('../admin/src/routes/userRoutes');
const productRoutes = require('../admin/src/routes/productRoutes');
const checkoutRoutes = require('../usuario/src/routes/checkoutRoutes');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Configuração de CORS para o front-end
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Servir arquivos estáticos
app.use('/admin', express.static(path.join(__dirname, '../admin/public')));
app.use('/usuario', express.static(path.join(__dirname, '../usuario/public')));
app.use('/uploads', express.static(path.join(__dirname, '../admin/public/uploads')));

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/checkout', checkoutRoutes);

// Redirecionamento e envio dos arquivos HTML
app.get('/', (req, res) => {
    res.redirect('/usuario');
});
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin/public/index.html'));
});
app.get('/usuario', (req, res) => {
    res.sendFile(path.join(__dirname, '../usuario/public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});