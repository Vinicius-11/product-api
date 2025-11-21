const autentificacao = require('../middleware/autentificacaoMiddleware');

// Login simples apenas para gerar token e proteger rotas
async function logar(req, res) {
    try {
        const { usuario, senha } = req.body;

        // Login básico (sem banco de dados por enquanto)
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
