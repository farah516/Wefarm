const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const superadminRoutes = require('./Routes/superadmin-route');
const userRoutes = require('./Routes/user-route');
const productRoutes = require('./Routes/product-route');
const aboutusRoutes = require('./Routes/aboutus-route');
const sectionContentRoutes = require('./Routes/sectionContent-route');
const settingsRoutes = require('./Routes/settings-route');
const serviceRoutes = require('./Routes/service-route');
const contactInformationRoutes = require('./Routes/contactInformation-route');
const subscriptionRoutesRoutes = require('./Routes/subscriptionRoutes');
const invoiceRoutes = require('./Routes/invoiceRoutes');
const claimRoutes = require('./Routes/claimRoutes');
const notificationRoutes = require('./Routes/notificationRoutes');


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: '*' }
  });
  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('🟢 Client connected');
  
    socket.on('registerUser', ({ userId, role }) => {
      if (userId && role) {
        socket.join(`user_${userId}`);
        socket.join(`role_${role}`);
        console.log(`👤 User ${userId} joined rooms user_${userId} & role_${role}`);
      }
    });
  
    socket.on('disconnect', () => {
      console.log('🔴 Client disconnected');
    });
  });
  

// app.use('/icons', express.static(path.join(__dirname, 'uploads/icons')));
app.use('/', express.static(path.join(__dirname, 'uploads/')));


app.use(express.json());
app.use('/superadmins', superadminRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/aboutus', aboutusRoutes);
app.use('/contactInformation', contactInformationRoutes);
app.use('/sectionContent', sectionContentRoutes);
app.use('/settings', settingsRoutes);
app.use('/service', serviceRoutes);
app.use('/subscription', subscriptionRoutesRoutes);
app.use('/invoice', invoiceRoutes);
app.use('/claim', claimRoutes);
app.use('/notification', notificationRoutes);
app.use('/uploads', express.static('uploads'));


app.get('/api/getListIcons', (req, res) => {
  const iconsDirectory = path.join(__dirname, 'uploads/icons');

  fs.readdir(iconsDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading icons directory' });
    }

    // Filter for icon files (assuming common icon formats)
    const iconFiles = files.filter(file => ['.png', '.jpg', '.jpeg', '.svg'].includes(path.extname(file)));

    res.json({
      icons: iconFiles.map(file => `/icons/${file}`),  // Send the public URL for each icon
    });
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
