const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    minlength: [3, 'Nome deve ter pelo menos 3 caracteres'],
    trim: true
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Produto', produtoSchema);
