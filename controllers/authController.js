const autentificacao = require('../middlewares/authMiddleware');

// Login básico para gerar token
async function logar(req, res) {
    try {
        const { usuario, senha } = req.body;

        // Login simples (sem banco de dados no momento)
        if (usuario !== "admin" || senha !== "1234") {
            return res.status(401).json({ msg: "Credenciais inválidas" });
        }

        // Payload do token
        const payload = {
            iss: "API de Produtos",
            aud: "Usuário Autenticado",
            usuario: "admin"
        };

        const token = autentificacao.gerarToken(payload);

        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { logar };
