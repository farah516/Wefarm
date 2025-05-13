const { Op } = require('sequelize');
const notifyUser = require('../utils/notifyUser');
const { Subscription, User, Invoice, sequelize } = require('../Models');


exports.createSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.create(req.body);
    const createdSubscription = await Subscription.findByPk(subscription.id, {
      include: {  
        model: User,
        as: 'user',
        attributes: ['id', 'fullname', 'email', 'role']
      }
    });
    await notifyUser({
      userId: createdSubscription.user.id,
      role: createdSubscription.user.role,
      title: 'Nouvelle abonnement',
      message: `Un nouvel abonnement de ${createdSubscription.startDate.toLocaleDateString('fr-FR')} a ${createdSubscription.endDate.toLocaleDateString('fr-FR')}  a été créée pour vous.`,
    }, req.app.get('io'));
    res.status(200).json(createdSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Subscription.update(req.body, {
      where: { id }
    });
    if (!updated) return res.status(404).json({ message: "Subscription not found" });
    const updatedSubscription = await Subscription.findByPk(id, {
      include: {  
        model: User,
        as: 'user',
        attributes: ['id', 'fullname', 'email', 'role']
      }
    });
    
    await notifyUser({
      userId: updatedSubscription.user.id,
      role: updatedSubscription.user.role,
      title: 'Abonnement mise à jour',
      message: `Votre abonnement de ${updatedSubscription.startDate.toLocaleDateString('fr-FR')} a ${updatedSubscription.endDate.toLocaleDateString('fr-FR')} a été modifiée.`,
    }, req.app.get('io'));

    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSubscription = await Subscription.findByPk(id, {
      include: {  
        model: User,
        as: 'user',
        attributes: ['id', 'fullname', 'email', 'role']
      }
    });
    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    await notifyUser({
      userId: deletedSubscription.user.id,
      role: deletedSubscription.user.role,
      title: 'Abonnement supprimé',
      message: `Votre abonnement  de ${deletedSubscription.startDate.toLocaleDateString('fr-FR')} a ${deletedSubscription.endDate.toLocaleDateString('fr-FR')} a été supprimé.`,
    }, req.app.get('io'));

    await Subscription.destroy({ where: { id } });

    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllSubscriptionsWithUsers = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['id','fullname', 'email']
      }
    });
    const count = await Subscription.count();

    res.status(200).json({ total: count, subscriptions:subscriptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscriptions = await Subscription.findAll({
      where: { userId }
    });
    const count = await Subscription.count({ where: { userId } });
    res.status(200).json({ total: count, subscriptions:subscriptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserUninvoicedSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;
    const uninvoicedSubscriptions = await Subscription.findAll({
      where: {
        userId
      },
      include: [
        {
          model: Invoice,
          as: 'invoices',
          required: false, 
          attributes: [], 
          through: { attributes: [] }
        }
      ],
      having: sequelize.literal('COUNT(`invoices`.`id`) = 0'),
      group: ['Subscription.id']
    });

    res.status(200).json({
      total: uninvoicedSubscriptions.length,
      subscriptions: uninvoicedSubscriptions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
