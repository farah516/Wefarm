const { Notification } = require('../Models');

const notifyUser = async ({ userId, title, message, role }, io) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    userRole: role || 'user',
    createdAt: new Date(),
  });

  if (io) {
    io.to(`user_${userId}`).to(`role_${role}`).emit('notification', notification);
  }

  return notification;
};

module.exports = notifyUser;
