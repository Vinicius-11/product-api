const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const usuarioController = require("../controllers/usuarioController");
const auth = require("../middlewares/authMiddleware");

// Criar usuário (rota aberta)
router.post("/", usuarioController.adicionarUsuario);

// Login
router.post("/login", authController.logar);

// Renovar token
router.post("/renovar", auth.verificarToken, auth.renovarToken);

// Listar todos
router.get("/", auth.verificarToken, usuarioController.listarUsuarios);

// Buscar por ID
router.get(
  "/:id",
  auth.verificarToken,
  usuarioController.buscarUsuario,
  usuarioController.exibirUsuario
);

// Atualizar usuário
router.put(
  "/:id",
  auth.verificarToken,
  usuarioController.buscarUsuario,
  usuarioController.editarUsuario
);

// Deletar usuário
router.delete(
  "/:id",
  auth.verificarToken,
  usuarioController.buscarUsuario,
  usuarioController.deletarUsuario
);

module.exports = router;
