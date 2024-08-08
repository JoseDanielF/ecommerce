const crypto = require('crypto');
const pool = require('../../config/db');
const axios = require('axios');
require('dotenv').config();

exports.registerUser = async (req, res) => {
    const { email, senha, nome, documento, telefone, endereco } = req.body;
    if (!email || !senha || !nome || !documento || !telefone || !endereco) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const senhaCriptografada = crypto.createHash('md5').update(senha).digest('hex');

    try {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const enderecoQuery = `
                INSERT INTO endereco (cep, logradouro, bairro, uf, pais, complemento, numero, cidade)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id;
            `;

            const enderecoResult = await client.query(enderecoQuery, [
                endereco.cep,
                endereco.logradouro,
                endereco.bairro,
                endereco.uf,
                endereco.pais,
                endereco.complemento,
                endereco.numero,
                endereco.cidade
            ]);

            const enderecoId = enderecoResult.rows[0].id;

            const usuarioQuery = `
                INSERT INTO usuario (email, senha, nome, telefone, documento, enderecoid)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;

            const userResult = await client.query(usuarioQuery, [email, senhaCriptografada, nome, telefone, documento, enderecoId]);

            await client.query('COMMIT');

            return res.status(201).json(userResult.rows[0]);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error(err);
            return res.status(500).json({ error: 'Erro ao cadastrar usuário e endereço' });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
    }
};

exports.loginUser = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const senhaCriptografada = crypto.createHash('md5').update(senha).digest('hex');

    try {
        const client = await pool.connect();

        const queryText = `
          SELECT 
                u.id, 
                u.email, 
                u.nome, 
                u.documento, 
                u.telefone, 
                u.deletado, 
                u.enderecoid,
                e.cep, 
                e.logradouro, 
                e.bairro, 
                e.uf, 
                e.pais, 
                e.complemento, 
                e.numero, 
                e.cidade
            FROM 
                usuario u
            INNER JOIN 
                endereco e ON u.enderecoid = e.id
            WHERE 
                u.email = $1 AND u.senha = $2;
        `;

        const result = await client.query(queryText, [email, senhaCriptografada]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        const user = result.rows[0];

        if (user.deletado) {
            return res.status(403).json({ error: 'Usuário desativado.' });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Erro ao fazer login.' });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, nome, documento, telefone, enderecoId, endereco } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    const allowedUpdates = ['email', 'nome', 'documento', 'telefone'];
    const updates = Object.keys(req.body).filter(update => allowedUpdates.includes(update));

    if (updates.length === 0 && !endereco) {
        return res.status(400).json({ error: 'Nenhum campo válido para atualização' });
    }

    let queryText = 'UPDATE usuario SET ';
    const queryValues = [];
    updates.forEach((field, index) => {
        queryValues.push(req.body[field]);
        queryText += `${field} = $${index + 1}, `;
    });
    queryText = queryText.slice(0, -2);
    queryText += ' WHERE id = $' + (updates.length + 1) + ' RETURNING *;';
    queryValues.push(id);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(queryText, queryValues);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        if (endereco) {
            const { cep, logradouro, bairro, uf, pais, complemento, numero, cidade, deletado } = endereco;
            const enderecoQuery = `
                UPDATE endereco
                SET cep = $1, logradouro = $2, bairro = $3, uf = $4, pais = $5,
                    complemento = $6, numero = $7, cidade = $8, deletado = $9
                WHERE id = $10
                RETURNING *;
            `;
            const enderecoValues = [cep, logradouro, bairro, uf, pais, complemento, numero, cidade, deletado, result.rows[0].enderecoid];
            const enderecoResult = await client.query(enderecoQuery, enderecoValues);

            if (enderecoResult.rows.length === 0) {
                await client.query('ROLLBACK');
                client.release();
                return res.status(404).json({ error: 'Endereço não encontrado' });
            }
        }

        await client.query('COMMIT');

        const tipoUsuarioQuery = `
            SELECT 
                u.id, 
                u.email, 
                u.nome, 
                u.documento, 
                u.telefone, 
                u.deletado, 
                u.enderecoid,
                e.cep, 
                e.logradouro, 
                e.bairro, 
                e.uf, 
                e.pais, 
                e.complemento, 
                e.numero, 
                e.cidade
            FROM usuario u
            INNER JOIN 
                endereco e ON u.enderecoid = e.id
            WHERE u.id = $1;
        `;

        const tipoUsuarioResult = await client.query(tipoUsuarioQuery, [id]);
        client.release();

        if (tipoUsuarioResult.rows.length === 0) {
            return res.status(404).json({ error: 'Erro ao recuperar informações do tipo de usuário' });
        }

        return res.status(200).json(tipoUsuarioResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

exports.deleteUser = async (req, res) => {

    const { senha, id } = req.body;
    if (!id || !senha) {
        return res.status(400).json({ error: 'ID e Senha do usuário são obrigatórias' });
    }
    const senhaCriptografada = crypto.createHash('md5').update(senha).digest('hex');
    const queryText = 'UPDATE usuario SET deletado = true WHERE id = $1 RETURNING *;';
    const querySenha = 'SELECT senha FROM usuario WHERE id = $1';
    try {
        const client = await pool.connect();
        const senhaUserResult = await client.query(querySenha, [id]);

        if (senhaUserResult.rows.length === 0) {
            client.release();
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const senhaHashDoBanco = senhaUserResult.rows[0].senha;
        if (senhaCriptografada === senhaHashDoBanco) {
            const result = await client.query(queryText, [id]);

            if (result.rows.length === 0) {
                client.release();
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            client.release();
            return res.status(200).json(result.rows[0]);
        } else {
            client.release();
            return res.status(401).json({ error: 'Senha incorreta' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
};

exports.consultCep = async (req, res) => {
    const { cep } = req.params;

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch CEP information', message: err.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const europeanResponse = await axios.get(`http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider`);
        const brazilianResponse = await axios.get(`http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider`);

        const combinedProducts = [...europeanResponse.data, ...brazilianResponse.data];

        res.json(combinedProducts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get products', message: err.message });
    }
};

exports.getProductByID = async (req, res) => {
    const { id } = req.params;

    try {
        const europeanResponse = await axios.get(`http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider/${id}`);
        const brazilianResponse = await axios.get(`http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider/${id}`);

        const combinedProduct = {
            europeanProvider: europeanResponse.data,
            brazilianProvider: brazilianResponse.data,
        };

        res.json(combinedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get products', message: err.message });
    }
};