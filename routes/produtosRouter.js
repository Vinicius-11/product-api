const express = require('express');
const router = express.Router();

const produtosController = require('../controllers/produtosController');
const auth = require('../middlewares/authMiddleware');

// Rotas CRUD para produtos

// Criar produto (protegido por token)
router.post('/', auth.verificarToken, produtosController.criar);

// Listar produtos (rota livre — ou coloque token se quiser)
router.get('/', produtosController.listar);

// Buscar produto por ID (livre ou protegido — você decide)
router.get('/:id', produtosController.buscar, produtosController.exibir);

// Atualizar produto (protegido)
router.put('/:id', auth.verificarToken, produtosController.buscar, produtosController.atualizar);

// Deletar produto (protegido)
router.delete('/:id', auth.verificarToken, produtosController.buscar, produtosController.remover);

module.exports = router;
