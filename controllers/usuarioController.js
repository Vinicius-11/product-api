const mongoose = require('mongoose');
const Produto = require('../models/produtosModel');

//Criar Produto
async function adicionarProduto(req, res) {
    try {
        const novoProduto = await Produto.create({
            nome: req.body.nome,
            preco: req.body.preco,
            descricao: req.body.descricao,
            estoque: req.body.estoque
        });

        return res.status(201).json(novoProduto);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

//Editar Produto
async function editarProduto(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    try {
        const produtoAtualizado = await Produto.findOneAndUpdate(
            { _id: id },
            {
                nome: req.body.nome,
                preco: req.body.preco,
                descricao: req.body.descricao,
                estoque: req.body.estoque
            },
            {
                runValidators: true,
                new: true
            }
        );

        return res.status(200).json(produtoAtualizado);

    } catch (err) {
        if (err.name === 'ValidationError') {
            const mensagens = Object.values(err.errors).map(e => e.message);
            return res.status(422).json({ msg: mensagens });
        }
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

//Listar Todos os Produtos
async function listarProdutos(req, res) {
    try {
        const produtos = await Produto.find({});
        return res.status(200).json(produtos);
    } catch (err) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
}

//Middleware para Buscar Produto por ID
async function buscarProduto(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "Parâmetro inválido" });

    const produtoEncontrado = await Produto.findById(id);

    if (produtoEncontrado) {
        req.produto = produtoEncontrado;
        return next();
    } else {
        return res.status(404).json({ msg: "Produto não encontrado" });
    }
}

//Exibir Produto Encontrado
async function exibirProduto(req, res) {
    return res.status(200).json(req.produto);
}

//Deletar Produto
async function deletarProduto(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: 'Parâmetro inválido' });

    try {
        await Produto.findOneAndDelete({ _id: id });
        return res.status(204).json({});
    } catch (err) {
        return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
}

module.exports = {
    adicionarProduto,
    editarProduto,
    listarProdutos,
    buscarProduto,
    exibirProduto,
    deletarProduto
};
