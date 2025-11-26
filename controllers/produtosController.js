const mongoose = require("mongoose");
const Produto = require("../models/produtosModel");

async function criar(req, res) {
  try {
    const { nome, preco } = req.body;
    const novoProduto = await Produto.create({ nome, preco });
    return res.status(201).json(novoProduto);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res
        .status(422)
        .json({ msg: "Nome e preço do produto são obrigatórios" });
    }
    console.error(err);
    return res.status(500).json({ msg: "Erro interno", erro: err.message });
  }
}

async function listar(req, res) {
  try {
    const produtosCadastrados = await Produto.find({});
    return res.status(200).json(produtosCadastrados);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro interno", erro: err.message });
  }
}

async function buscar(req, res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Parâmetro inválido" });
  }

  try {
    const produtoEncontrado = await Produto.findById(id);
    if (produtoEncontrado) {
      req.produto = produtoEncontrado;
      return next();
    } else {
      return res.status(404).json({ msg: "Produto não encontrado" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro interno", erro: err.message });
  }
}

function exibir(req, res) {
  return res.status(200).json(req.produto);
}

async function atualizar(req, res) {
  try {
    const { id } = req.params;
    const { nome, preco } = req.body;

    const produtoAtualizado = await Produto.findOneAndUpdate(
      { _id: id },
      { nome, preco },
      { new: true, runValidators: true }
    );

    if (!produtoAtualizado) {
      return res.status(404).json({ msg: "Produto não encontrado" });
    }

    return res.status(200).json(produtoAtualizado);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res
        .status(422)
        .json({ msg: "Nome e preço do produto são obrigatórios" });
    }
    console.error(err);
    return res.status(500).json({ msg: "Erro interno", erro: err.message });
  }
}

async function remover(req, res) {
  try {
    const { id } = req.params;
    await Produto.findOneAndDelete({ _id: id });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erro interno", erro: err.message });
  }
}

module.exports = {
  criar,
  listar,
  buscar,
  exibir,
  atualizar,
  remover,
};
