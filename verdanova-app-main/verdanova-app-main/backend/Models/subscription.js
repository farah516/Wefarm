module.exports = (sequelize, DataTypes) => {
    const Subscription = sequelize.define("Subscription", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endDate: {
        type: DataTypes.DATE, 
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Pending', 'Expired'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      paymentMethod: {
        type: DataTypes.ENUM('Check', ' Transfer', 'cash'),
        allowNull: true,
      },
      paymentStatus: {
        type: DataTypes.ENUM('Paid', 'Pending', 'Late'),
        allowNull: false,
        defaultValue: 'Pending'
      }
      
    },{timestamps: false});
  
    Subscription.associate = (models) => {
      Subscription.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Subscription.belongsToMany(models.Invoice, {
        through: 'InvoiceSubscriptions',
        foreignKey: 'subscriptionId',
        otherKey: 'invoiceId',
        as: 'invoices'
      });
    };
  
    return Subscription;
  };
  