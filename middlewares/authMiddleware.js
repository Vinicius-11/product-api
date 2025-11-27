const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Token ausente" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = { ...payload };

    return next();
  } catch (err) {
    return res.status(401).json({ msg: "Token inválido" });
  }
}

function gerarToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "60m"
    }
  );
}

function renovarToken(req, res) {
  try {
    if (!req.usuario) {
      return res.status(401).json({ msg: "Token inválido" });
    }

    const payload = { ...req.usuario };
    delete payload.iat;
    delete payload.exp;

    const novo = gerarToken(payload);

    return res.json({ token: novo });
  } catch (err) {
    return res.status(500).json({ msg: "Erro ao renovar token" });
  }
}

module.exports = {
  verificarToken,
  gerarToken,
  renovarToken
};
