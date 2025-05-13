import { io } from 'socket.io-client';
let socket;

export const connectToSocket = (userId, userRole, notificationStore) => {
  if (socket || !userId || !userRole) return;

  const url = process.env.REACT_APP_BACKEND_URL;

  socket = io(`${url}`, {
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('✅ Connected to socket server');
    socket.emit('registerUser', { userId, role: userRole });
  });

  socket.on('notification', (notification) => {
    notificationStore.addNotification(notification, userId, userRole);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Disconnected from socket server');
  }
};
