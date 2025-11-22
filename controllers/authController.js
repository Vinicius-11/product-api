const auth = require('../middlewares/authMiddleware');

async function logar(req, res) {
    try {
        const { usuario, senha } = req.body;

        if (usuario !== "admin" || senha !== "1234") {
            return res.status(401).json({ msg: "Credenciais inválidas" });
        }

        const payload = { usuario: "admin" };

        const token = auth.gerarToken(payload);

        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { logar };
