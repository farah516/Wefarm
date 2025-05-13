import Invoice from '../models/Invoice.js';

export const getInvoices = async (req, res) => {
    try {
      const invoices = await Invoice.find();
      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving invoices' });
    }
  };
  
  export const createInvoice = async (req, res) => {
    try {
      const { clientName, amount, dueDate, status } = req.body;  
  
      if (!clientName || !amount || !dueDate || !status) {  
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
      }

      const newInvoice = new Invoice({
        clientName,
        amount,
        dueDate,
        status,  
      });
  
      await newInvoice.save();
  
      res.status(201).json(newInvoice);
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);  
      res.status(500).json({ message: error.message });
    }
  };
  
export const uploadInvoiceFile = (req, res) => {
  try {
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' });
  }
};

export const deleteInvoice = async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = await Invoice.findByIdAndDelete(id);
  
      if (!invoice) {
        return res.status(404).json({ message: "Facture non trouvée." });
      }
  
      res.status(200).json({ message: "Facture supprimée avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de la facture:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
