const Usuario = require('../models/usuarioModel');
const auth = require('../middlewares/authMiddleware');

async function logar(req, res) {
    try {
        const { email, senha } = req.body;

        const user = await Usuario.findOne({ email }).select("+senha");
        if (!user) {
            return res.status(401).json({ msg: "Usuário não encontrado" });
        }

        if (user.senha !== senha) {
            return res.status(401).json({ msg: "Senha incorreta" });
        }

        const payload = {
            id: user._id,
            email: user.email,
            nome: user.nome
        };

        const token = auth.gerarToken(payload);

        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { logar };