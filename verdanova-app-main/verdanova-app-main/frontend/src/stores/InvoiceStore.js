import { makeAutoObservable } from "mobx";

class InvoiceStore {
  AllInvoices = [];
  UserInvoices = [];

  constructor() {
    makeAutoObservable(this);
  }

  addInvoice = (invoice,id) => {
    this.AllInvoices.push(invoice);
    if(invoice.userId === Number(id)) {
      this.UserInvoices.push(invoice);
    }
  };

  removeInvoice  = (id) => {
    this.AllInvoices = this.AllInvoices.filter(invoice => invoice.id !== id);
    this.UserInvoices = this.UserInvoices.filter(invoice => invoice.id !== id);
  };

  getInvoices(invoices) {
    this.AllInvoices = invoices;
  }

  getUserInvoices(invoices) {
    this.UserInvoices = invoices;
  }

  editInvoice = (id, updatedInvoice,userId) => {
    const index = this.AllInvoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
      this.AllInvoices[index] = { ...this.AllInvoices[index], ...updatedInvoice };
    }
    const index2 = this.UserInvoices.findIndex(invoice => invoice.id === id && invoice.userId === Number(userId));
    if (index2 !== -1) {
      this.UserInvoices[index2] = { ...this.UserInvoices[index2], ...updatedInvoice };
    }
  };

}

const invoiceStore = new InvoiceStore();
export default invoiceStore;
