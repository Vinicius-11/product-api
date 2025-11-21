require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Import da conexão com o banco
const ConectarDB = require('./config/database');

// Import das rotas
const produtosRouter = require('./routes/produtosRouter');

const app = express();

// Conectar ao banco
ConectarDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROTAS
app.use('/produtos', produtosRouter);

// 404 para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ msg: 'Rota não encontrada' });
});

module.exports = app;
