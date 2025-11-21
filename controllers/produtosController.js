const mongoose = require('mongoose');
const Produto = require('../models/produtosModel');

/**
 * POST /produtos
 */
async function criar(req, res) {
  try {
    const { nome, preco } = req.body;
    const novoProduto = await Produto.create({ nome, preco });
    return res.status(201).json(novoProduto);
  } catch (err) {
    // Tratamento para erro de validação do Mongoose
    if (err && err.name === 'ValidationError') {
      return res.status(422).json({ msg: 'Nome e preço do produto são obrigatórios' });
    }
    // fallback
    return res.status(500).json({ msg: 'Erro interno' });
  }
}

/**
 * GET /produtos
 */
async function listar(req, res) {
  try {
    const produtosCadastrados = await Produto.find({});
    return res.status(200).json(produtosCadastrados);
  } catch (err) {
    return res.status(500).json({ msg: 'Erro interno' });
  }
}

/**
 * Middleware: buscar produto por id (usa req.params.id)
 * - valida id
 * - carrega produto em req.produto e chama next()
 * - retorna 400 ou 404 quando apropriado
 */
async function buscar(req, res, next) {
  const { id } = req.params;

  // validação do id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Parâmetro inválido' });
  }

  try {
    const produtoEncontrado = await Produto.findById(id);
    if (produtoEncontrado) {
      req.produto = produtoEncontrado;
      return next();
    } else {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ msg: 'Erro interno' });
  }
}

/**
 * GET /produtos/:id  (deve ser chamado após o middleware buscar)
 */
function exibir(req, res) {
  return res.status(200).json(req.produto);
}

/**
 * PUT /produtos/:id
 * - pressupõe que o middleware buscar já rodou e validou id e existência
 */
async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, preco } = req.body;

    // Atualiza com validação do schema
    const produtoAtualizado = await Produto.findOneAndUpdate(
      { _id: id },
      { nome, preco },
      { new: true, runValidators: true }
    );

    // Se por algum motivo não existe (já tratado no buscar), devolve 404
    if (!produtoAtualizado) {
      return res.status(404).json({ msg: 'Produto não encontrado' });
    }

    return res.status(200).json(produtoAtualizado);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.status(422).json({ msg: 'Nome e preço do produto são obrigatórios' });
    }
    return res.status(500).json({ msg: 'Erro interno' });
  }
}

/**
 * DELETE /produtos/:id
 * - pressupõe middleware buscar
 */
async function remover(req, res) {
  try {
    const { id } = req.params;
    await Produto.findOneAndDelete({ _id: id });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ msg: 'Erro interno' });
  }
}

module.exports = {
  criar,
  listar,
  buscar,
  exibir,
  atualizar,
  remover
};
