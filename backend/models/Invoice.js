import mongoose from 'mongoose';

// Enum des statuts valides
const statusEnum = ['pending', 'paid', 'overdue'];

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: statusEnum,
    required: true,
  },
});

// Middleware pour générer un numéro de facture unique avant de sauvegarder
invoiceSchema.pre('save', function (next) {
  if (this.isNew) {
    this.invoiceNumber = `INV-${Math.floor(1000 + Math.random() * 9000)}`; // Exemple de génération de numéro aléatoire
  }
  next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);
export default Invoice;
