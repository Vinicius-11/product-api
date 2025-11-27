require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const ConectarDB = require('./config/database.js');

const produtosRouter = require('./routes/produtosRouter');
const usuariosRouter = require('./routes/usuariosRouter');

const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');

const app = express();

ConectarDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/produtos', produtosRouter);
app.use('/usuarios', usuariosRouter);

const swaggerPath = './swagger.yaml';

try {
  const file = fs.readFileSync(swaggerPath, 'utf8');
  const swaggerDocument = YAML.parse(file);
  app.use('/product-api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
  console.error('Erro ao carregar swagger.yaml:', e.message);
}

// 404
app.use((req, res) => {
  res.status(404).json({ msg: 'Rota não encontrada' });
});

module.exports = app;
