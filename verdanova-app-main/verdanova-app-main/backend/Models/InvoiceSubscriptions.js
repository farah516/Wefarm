module.exports = (sequelize, DataTypes) => {
const InvoiceSubscription = sequelize.define('InvoiceSubscriptions', {
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Invoices',
        key: 'id'
      }
    },
    subscriptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Subscriptions',
        key: 'id'
      }
    }
  }, {
    timestamps: false 
  });
  return InvoiceSubscription;
};