const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
        return res.status(401).json({ msg: 'Token ausente' });
    }

    try {
        let payload = null;

        // Suporte a "Bearer token"
        if (authHeader.includes("Bearer ")) {
            const token = authHeader.split(" ")[1];
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } else {
            payload = jwt.verify(authHeader, process.env.JWT_SECRET);
        }

        req.usuario = {
            email: payload.email // você pode incluir mais dados caso queira
        };

        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token inválido" });
    }
}

// Gerar novo token
function gerarToken(payload) {
    try {
        const expiresIn = process.env.JWT_EXPIRES || "60m";
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
        return token;
    } catch (err) {
        throw new Error("Erro ao gerar token");
    }
}

// Rota interna de renovação
function renovarToken(req, res) {
    try {
        const payload = req.usuario;
        const novoToken = gerarToken(payload);
        return res.json({ token: novoToken });
    } catch (err) {
        return res.status(500).json({ msg: "Erro ao renovar token" });
    }
}

module.exports = {
    verificarToken,
    gerarToken,
    renovarToken
};
