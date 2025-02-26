const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../../../src/database.js');

// Define o diretório de upload e cria-o se não existir
const uploadDir = path.join(__dirname, '../../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura o armazenamento de arquivos com multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rotas de produto
router.post('/', upload.array('imagens'), productController.addProduct);
router.put('/:id', upload.array('imagens'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/', productController.getAllProducts);

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute(
            `SELECT * FROM produtos WHERE id_produto = ?`,
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Erro ao buscar produto:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

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