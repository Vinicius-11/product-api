const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

async function adicionarUsuario(req, res) {
    try {
        const { nome, email, senha } = req.body;

        if (!email || !senha) {
            return res.status(422).json({ msg: "Email e Senha são obrigatórios" });
        }

        const dados = {
            nome: nome || "Usuário",
            email,
            senha: await bcrypt.hash(senha, 10)
        };

        const novo = await Usuario.create(dados);
        return res.status(201).json(novo);

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
    return res.status(204).send();
}

module.exports = {
    adicionarUsuario,
    listarUsuarios,
    buscarUsuario,
    exibirUsuario,
    editarUsuario,
    deletarUsuario
};
