'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Invoices', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      invoiceNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      invoiceDate: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Invoices');
  }
};

