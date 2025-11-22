require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const ConectarDB = require('./config/database.js');

const produtosRouter = require('./routes/produtosRouter');
const usuariosRouter = require('./routes/usuariosRouter');

const app = express();

ConectarDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROTAS
app.use('/produtos', produtosRouter);
app.use('/usuarios', usuariosRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ msg: 'Rota não encontrada' });
});

module.exports = app;
