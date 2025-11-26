const express = require('express');
const router = express.Router();

const produtosController = require('../controllers/produtosController');
const auth = require('../middlewares/authMiddleware');


router.post('/', auth.verificarToken, produtosController.criar);

router.get('/', produtosController.listar);

router.get('/:id', produtosController.buscar, produtosController.exibir);

router.put('/:id', auth.verificarToken, produtosController.buscar, produtosController.atualizar);

router.delete('/:id', auth.verificarToken, produtosController.buscar, produtosController.remover);

module.exports = router;
