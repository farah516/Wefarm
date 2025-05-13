module.exports = (sequelize, DataTypes) => {
    const Claim = sequelize.define("Claim", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', 
          key: 'id', 
        },
        onDelete: 'CASCADE',
      },
      responsibleAdmin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Users', 
          key: 'id', 
        },
        onDelete: 'SET NULL', 
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      claimResponse: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('Untreated', 'Treated', 'InProgress'),
        allowNull: false,
        defaultValue: 'Untreated',
      },
      type: {
        type: DataTypes.ENUM('TechnicalBug', 'Suggestion', 'RequestAssistance', 'Other'),
        allowNull: false,
      },
      priority: {
        type: DataTypes.ENUM('High', 'Average', 'Low'),
        allowNull: false,
      },
    },{timestamps: false});
  
    Claim.associate = (models) => {
      Claim.belongsTo(models.User, {
        foreignKey: 'createdBy',
        as: 'creator',
        onDelete: 'CASCADE',
      });
  
      Claim.belongsTo(models.User, {
        foreignKey: 'responsibleAdmin',
        as: 'admin',
        onDelete: 'SET NULL',
      });
    };
  
    return Claim;
  };
  