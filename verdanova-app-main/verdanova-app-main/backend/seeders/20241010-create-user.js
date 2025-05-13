'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Generate a hashed password
    const hashedPassword = await bcrypt.hash('userpassword123', 10);

    return queryInterface.bulkInsert('Users', [
      {
        fullname: 'John Doe',
        email: 'Ksourif220@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        companyName: 'Example Company',
        companyFunctionality: 'Technology',
        phoneNumber: '+123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: 'Jane Smith',
        email: 'farahksouri80@gmail.com',
        password: hashedPassword,
        role: 'user',
        isActive: true,
        companyName: 'Tech Innovations',
        companyFunctionality: 'Software',
        phoneNumber: '+987654321',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
