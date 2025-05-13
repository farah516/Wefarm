const { Notification } = require('../Models');


  exports.deleteNotification = async (req, res) => {
    try {
      const { id } = req.params;
      const notification = await Notification.findByPk(id);
      if (!notification) return res.status(404).json({ error: 'Notification not found' });
  
      await notification.destroy();
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  exports.getUserNotifications = async (req, res) => {
    try {
      const { id,role } = req.params;
      const notifications = await Notification.findAll({
        where: { userId: id, userRole:role }
      });
      res.status(200).json({notifications:notifications});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  

  
  
  