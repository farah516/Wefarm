const fs = require('fs');
const path = require('path');
const notifyUser = require('../utils/notifyUser');
const { Invoice, User, Subscription } = require('../Models');
const PDFDocument = require('pdfkit'); 


exports.createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, invoiceDate, userId, subscriptionIds } = req.body;

    const invoice = await Invoice.create({ invoiceNumber, invoiceDate, userId });

    if (subscriptionIds && subscriptionIds.length > 0) {
      await invoice.setSubscriptions(subscriptionIds);
    }

    const newInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id','fullname', 'phoneNumber', 'role']
        },
        {
          model: Subscription,
          as: 'subscriptions',
          attributes: ['id','startDate', 'endDate', 'price', 'status', 'paymentMethod', 'paymentStatus']
        }
      ]
    });

    await notifyUser({
      userId: newInvoice.client.id,
      role: newInvoice.client.role,
      title: 'Nouvelle facture',
      message: `Une nouvelle facture avec une réference ${newInvoice.invoiceNumber} a été créée pour vous.`,
    }, req.app.get('io'));

    res.status(200).json(newInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceNumber, invoiceDate, userId, subscriptionIds } = req.body;

    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    await invoice.update({ invoiceNumber, invoiceDate, userId });

    if (subscriptionIds) {
      await invoice.setSubscriptions(subscriptionIds);
    }

    const updatedInvoice = await Invoice.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id','fullname', 'phoneNumber', 'role']
        },
        {
          model: Subscription,
          as: 'subscriptions',
          attributes: ['id','startDate', 'endDate', 'price', 'status', 'paymentMethod', 'paymentStatus']
        }
      ]
    });

    await notifyUser({
      userId: updatedInvoice.client.id,
      role: updatedInvoice.client.role,
      title: 'Facture mise à jour',
      message: `Votre facture avec la réference ${updatedInvoice.invoiceNumber} a été modifiée.`,
    }, req.app.get('io'));

    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id','fullname', 'phoneNumber', 'role']
        },
        {
          model: Subscription,
          as: 'subscriptions',
          attributes: ['id','startDate', 'endDate', 'price', 'status', 'paymentMethod', 'paymentStatus']
        }
      ]
    });

    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    await notifyUser({
      userId: invoice.client.id,
      role: invoice.client.role,
      title: 'Abonnement supprimé',
      message: `Votre abonnement avec la réference ${invoice.invoiceNumber} a été supprimé.`,
    }, req.app.get('io'));

    await invoice.destroy();
    res.status(200).json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllInvoicesWithDetails = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id','fullname', 'phoneNumber']
        },
        {
          model: Subscription,
          as: 'subscriptions',
          attributes: ['id','startDate', 'endDate', 'price', 'status', 'paymentMethod', 'paymentStatus']
        }
      ]
    });

    const count = await Invoice.count();

    res.status(200).json({ total: count, invoices:invoices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserInvoices = async (req, res) => {
  try {
    const { userId } = req.params;

    const invoices = await Invoice.findAll({
      where: { userId },
      include: {
        model: Subscription,
        as: 'subscriptions',
        attributes: ['id','startDate', 'endDate', 'price', 'status', 'paymentMethod', 'paymentStatus']
      }
    });

    const count = await Invoice.count({ where: { userId } });

    res.status(200).json({ total: count, invoices:invoices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function drawBadge(doc, text, x, y, width, bgColor) {
  doc.save();
  doc.rect(x, y, width, 16).fill(bgColor);
  doc
    .fillColor('white')
    .fontSize(10)
    .text(text, x, y + 3, {
      width: width,
      align: 'center',
      height: 16,
    });
  doc.restore();
}

exports.generateInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findByPk(id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['fullname', 'phoneNumber', 'email'],
        },
        {
          model: Subscription,
          as: 'subscriptions',
          attributes: ['startDate', 'endDate', 'price', 'status', 'paymentMethod', 'paymentStatus'],
        },
      ],
    });

    if (!invoice) return res.status(404).json({ error: 'Facture introuvable.' });

    const doc = new PDFDocument({ margin: 50 });
    let chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=weefarm-facture-${invoice.invoiceNumber}.pdf`);
      res.status(200).send(result);
    });

    const logoPath = path.join(__dirname, '../assets/logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 60 });
    }

    doc.fillColor('#4abfec').fontSize(20).text(`Facture #${invoice.invoiceNumber}`, 0, 50, { align: 'center' });

    doc
      .fontSize(12)
      .fillColor('black')
      .text(`Date : ${new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}`, 0, 120, { align: 'right' })
      .text(`Client : ${invoice.client.fullname}`, { align: 'right' })
      .text(`Téléphone : ${invoice.client.phoneNumber}`, { align: 'right' })
      .text(`Email : ${invoice.client.email}`, { align: 'right' });

    doc.moveDown(2);

    const tableStartX = 50;
    const colWidths = {
      index: 30,
      period: 130,
      price: 70,
      status: 80,
      method: 100,
      paymentStatus: 100,
    };

    doc
      .fillColor('#00cd45')
      .fontSize(14)
      .text('Détails des souscriptions :', tableStartX, doc.y, { underline: true });

    doc.moveDown(0.5);
    doc.fontSize(11).fillColor('black');

    doc.text('#', tableStartX, doc.y, { continued: true });
    doc.text('Période', tableStartX + colWidths.index, doc.y, { continued: true });
    doc.text('Montant', tableStartX + colWidths.index + colWidths.period, doc.y, { continued: true });
    doc.text('Statut', tableStartX + colWidths.index + colWidths.period + colWidths.price, doc.y, { continued: true });
    doc.text('Paiement', tableStartX + colWidths.index + colWidths.period + colWidths.price + colWidths.status, doc.y, { continued: true });
    doc.text('État paiement', tableStartX + colWidths.index + colWidths.period + colWidths.price + colWidths.status + colWidths.method, doc.y);

    doc.moveDown(1.5);
    doc.moveTo(tableStartX, doc.y).lineTo(550, doc.y).stroke(); 
    doc.moveDown(0.5);

    let total = 0;
    for (let i = 0; i < invoice.subscriptions.length; i++) {
      const sub = invoice.subscriptions[i];
      const start = new Date(sub.startDate).toLocaleDateString('fr-FR');
      const end = new Date(sub.endDate).toLocaleDateString('fr-FR');
      const period = `Du ${start}\nau ${end}`;
      const price = `${sub.price} dt`;
      const method = sub.paymentMethod || 'Non spécifiée';
      const rowY = doc.y;

      total += parseFloat(sub.price);

      doc.fontSize(10).fillColor('black');
      doc.text(`${i + 1}`, tableStartX, rowY);
      doc.text(period, tableStartX + colWidths.index, rowY);
      doc.text(price, tableStartX + colWidths.index + colWidths.period, rowY);

      drawBadge(doc, sub.status, tableStartX + colWidths.index + colWidths.period + colWidths.price, rowY, colWidths.status - 10, '#00cd45');
      drawBadge(doc, method, tableStartX + colWidths.index + colWidths.period + colWidths.price + colWidths.status, rowY, colWidths.method - 10, '#4abfec');
      drawBadge(doc, sub.paymentStatus, tableStartX + colWidths.index + colWidths.period + colWidths.price + colWidths.status + colWidths.method, rowY, colWidths.paymentStatus - 10, '#00cd45');

      doc.moveDown(2);
    }
    doc
      .fontSize(13)
      .fillColor('black')
      .moveDown(0.5)
      .text(`Total à payer : ${total.toFixed(2)} dt`, { align: 'right' });

      doc.moveDown(4).fontSize(12);

      const textY = doc.y;
      const text = 'WEeFARM';
      const textWidth = doc.widthOfString(text);
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const x = doc.page.margins.left + (pageWidth - textWidth); 
      
      doc.fillColor('#00cd45').text('WEe', x, textY, { continued: true });
      doc.fillColor('#4abfec').text('FARM');
      

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

