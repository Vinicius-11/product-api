const Usuario = require('../models/usuarioModel');
const auth = require('../middlewares/authMiddleware');
const bcrypt = require('bcrypt');

async function logar(req, res) {
    try {
        const email = req.body.email || req.body.usuario; 
        const senha = req.body.senha;

        if (!email || !senha) {
            return res.status(401).json({ msg: "Credenciais inválidas" });
        }

        // precisa buscar com a senha (select:false no model)
        const user = await Usuario.findOne({ email }).select("+senha");

        if (!user) {
            return res.status(401).json({ msg: "Credenciais inválidas" });
        }

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ msg: "Credenciais inválidas" });
        }

        const payload = {
            id: user._id,
            email: user.email,
            nome: user.nome
        };

        const token = auth.gerarToken(payload);

        return res.status(200).json({ token });

    } catch (err) {
        console.error("Erro logar:", err);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { logar };
