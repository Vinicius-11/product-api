const Usuario = require('../models/usuarioModel');
const mongoose = require('mongoose');

async function adicionarUsuario(req, res) {
    try {
        const novo = await Usuario.create(req.body);
        res.status(201).json(novo);
    } catch (err) {
        return res.status(500).json({ msg: "Erro ao criar usuário" });
    }
}

async function listarUsuarios(req, res) {
    const lista = await Usuario.find({});
    res.json(lista);
}

async function buscarUsuario(req, res, next) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ msg: "ID inválido" });

    const user = await Usuario.findById(id);

    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });

    req.usuarioBuscado = user;
    next();
}

function exibirUsuario(req, res) {
    res.json(req.usuarioBuscado);
}

async function editarUsuario(req, res) {
    const atualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(atualizado);
}

async function deletarUsuario(req, res) {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(204).send();
}

module.exports = {
    adicionarUsuario,
    listarUsuarios,
    buscarUsuario,
    exibirUsuario,
    editarUsuario,
    deletarUsuario
};

