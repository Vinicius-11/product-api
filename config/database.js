const mongoose = require('mongoose');

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PSWD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DBNM}`;

const ConectarDB = async () => {
  try {
    await mongoose.connect(url); // remove opções antigas
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = ConectarDB;
