module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define("Invoice", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      invoiceDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    },{timestamps: false});
  
    Invoice.associate = (models) => {
      Invoice.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'client',
        onDelete: 'CASCADE'
      });
  
      Invoice.belongsToMany(models.Subscription, {
        through: 'InvoiceSubscriptions',
        foreignKey: 'invoiceId',
        otherKey: 'subscriptionId',
        as: 'subscriptions'
      });
    };
  
    return Invoice;
  };
  