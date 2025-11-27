const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const usuarioController = require("../controllers/usuarioController");
const auth = require("../middlewares/authMiddleware");

router.post("/", usuarioController.adicionarUsuario);

router.post("/login", authController.logar);

router.post("/renovar", auth.verificarToken, auth.renovarToken);

router.get("/", auth.verificarToken, usuarioController.listarUsuarios);

router.get("/:id", auth.verificarToken, usuarioController.buscarUsuario, usuarioController.exibirUsuario);

router.put("/:id", auth.verificarToken, usuarioController.buscarUsuario, usuarioController.editarUsuario);

router.delete("/:id", auth.verificarToken, usuarioController.buscarUsuario, usuarioController.deletarUsuario);

module.exports = router;
