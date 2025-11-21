const express = require('express');
const router = express.Router();

const autentificacaoController = require('../controllers/authController');
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/authMiddleware');

// Criar usuário (aberto)
router.post('/', usuarioController.adicionarUsuario);

// Login (gera token)
router.post('/login', autentificacaoController.logar);

// Renovar token
router.post('/renova', auth.verificarToken, auth.renovarToken);

// Listar usuários (com token)
router.get('/', auth.verificarToken, usuarioController.listarUsuarios);

// Buscar usuário por ID
router.get('/:id', auth.verificarToken, usuarioController.buscarUsuario, usuarioController.exibirUsuario);

// Atualizar usuário
router.put('/:id', auth.verificarToken, usuarioController.buscarUsuario, usuarioController.editarUsuario);

// Deletar usuário
router.delete('/:id', auth.verificarToken, usuarioController.buscarUsuario, usuarioController.deletarUsuario);

module.exports = router;
