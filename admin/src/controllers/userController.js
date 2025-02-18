const bcrypt = require('bcrypt');
const pool = require('../../../src/database.js');

// Registra um novo usuário
exports.register = async (req, res) => {
    try {
        console.log('Registration request:', req.body);
        const { nome, email, senha, cpf_cnpj, cep, endereco } = req.body;
        if (!nome || !email || !senha || !cpf_cnpj) {
            return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos' });
        }
        const [existingUser] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }
        const hashedPassword = await bcrypt.hash(senha, 10);
        const [result] = await pool.execute(
            'INSERT INTO usuarios (nome, email, senha, cpf_cnpj, cep, endereco) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, email, hashedPassword, cpf_cnpj, cep, endereco]
        );
        res.status(201).json({ message: 'Usuário registrado com sucesso', userId: result.insertId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
};

// Autentica o usuário
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }
        const [users] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        const user = users[0];
        const isValidPassword = await bcrypt.compare(senha, user.senha);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }
        res.status(200).json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                cpf_cnpj: user.cpf_cnpj,
                cep: user.cep,
                endereco: user.endereco
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erro ao realizar login', error: error.message });
    }
};

// Atualiza os dados do perfil do usuário
exports.updateProfile = async (req, res) => {
    try {
        const { nome, email, cpf_cnpj, cep, endereco, senha, id } = req.body;
        let updateQuery = `
            UPDATE usuarios 
            SET nome = ?, 
                email = ?, 
                cpf_cnpj = ?, 
                cep = ?, 
                endereco = ?
        `;
        let params = [nome, email, cpf_cnpj, cep, endereco];
        if (senha) {
            const hashedPassword = await bcrypt.hash(senha, 10);
            updateQuery += `, senha = ?`;
            params.push(hashedPassword);
        }
        updateQuery += ` WHERE id = ?`;
        params.push(id);
        const [result] = await pool.execute(updateQuery, params);
        if (result.affectedRows > 0) {
            res.status(200).json({
                message: 'Perfil atualizado com sucesso',
                user: { id, nome, email, cpf_cnpj, cep, endereco }
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
    }
};