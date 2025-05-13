const { Claim, User, Superadmin } = require('../Models');
const { Sequelize } = require("sequelize");
const notifyUser = require('../utils/notifyUser');
const { sendEmail } = require('./nodemailerConfig');

exports.createClaim = async (req, res) => {
    try {
      const { subject, type } = req.body;
      const { id } = req.params;
      const createdBy = id; 
        let priority;
        switch (type) {
            case 'TechnicalBug':
                priority = 'High';
                break;
            case 'Suggestion':
                priority = 'Low';
                break;
            case 'RequestAssistance':
                priority = 'Average';
                break;
            default:
                priority = 'Low'; 
        }
      const claim = await Claim.create({
        createdBy:createdBy,
        responsibleAdmin: null, 
        createdAt:new Date(),
        subject:subject,
        claimResponse: null,
        status: 'Untreated',
        type:type,
        priority: priority,
      });
      const createdclaim = await Claim.findByPk(claim.id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id','fullname','email']
          },
          {
            model: User,
            as: 'admin',
            attributes: ['id','fullname','email']
          }
        ]
      });
      const superadmins = await Superadmin.findAll();
      if(superadmins && superadmins.length > 0) {
        for (const admin of superadmins) {
          await notifyUser({
            userId: admin.id,
            role: "superadmin",
            title: 'Nouvelle réclamation',
            message: `Une nouvelle réclamation créée par le utulisateur ${createdclaim.creator.fullname}`,
          }, req.app.get('io'));
        }
      }
      res.status(200).json(createdclaim);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateClaim = async (req, res) => {
    try {
      const { id } = req.params;
      const { subject, type } = req.body;
  
      const claim = await Claim.findByPk(id);
      if (!claim) return res.status(404).json({ error: 'Claim not found' });
      let priority;
      switch (type) {
          case 'TechnicalBug':
              priority = 'High';
              break;
          case 'Suggestion':
              priority = 'Low';
              break;
          case 'RequestAssistance':
              priority = 'Average';
              break;
          default:
              priority = 'Low'; 
      }
      await claim.update({ subject, type , priority });
      const updatedClaim = await Claim.findByPk(claim.id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id','fullname','email']
          },
          {
            model: User,
            as: 'admin',
            attributes: ['id','fullname','email']
          }
        ]
      });

      const superadmins = await Superadmin.findAll();
      if(superadmins && superadmins.length > 0) {
        for (const admin of superadmins) {
          await notifyUser({
            userId: admin.id,
            role: "superadmin",
            title: 'Réclamation mise à jour',
            message: `Une réclamation créée par le utulisateur ${createdclaim.creator.fullname} a été modifiée`,
          }, req.app.get('io'));
        }
      }
      res.status(200).json(updatedClaim);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteClaim = async (req, res) => {
    try {
      const { id } = req.params;
      const claim = await Claim.findByPk(id);
      if (!claim) return res.status(404).json({ error: 'Claim not found' });
  
      await claim.destroy();
      res.status(200).json({ message: 'Claim deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.assignAdminToClaim = async (req, res) => {
    try {
      const { claimId, adminId, priority } = req.body;
      const claim = await Claim.findByPk(claimId, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'fullName', 'email']
          }
        ]
      });
  
      if (!claim) return res.status(404).json({ error: 'Claim not found' });
  
      if (priority !== claim.priority) {
        claim.priority = priority;
      }
  
      claim.responsibleAdmin = adminId;
      claim.status = 'InProgress';
      await claim.save();
      const updatedClaim = await Claim.findByPk(claimId, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id','fullname','email', 'role']
          },
          {
            model: User,
            as: 'admin',
            attributes: ['id','fullname','email', 'role']
          }
        ]
      });

      await notifyUser({
        userId: updatedClaim.admin.id,
        role: updatedClaim.admin.role,
        title: 'Nouvelle réclamation assignée à vous',
        message: `la réclamation créée par le utulisateur ${updatedClaim.creator.fullname} a été assignée à vous`,
      }, req.app.get('io'));

      await notifyUser({
        userId: updatedClaim.creator.id,
        role: updatedClaim.creator.role,
        title: 'Votre réclamation est en cours de traitement',
        message: `votre réclamation  est en cours de traitement par  ${updatedClaim.admin.fullname}`,
      }, req.app.get('io'));
  
      const message = `Hi ${updatedClaim.admin.fullname} , you have been assigned to treat a claim by the user ${updatedClaim.creator.fullname}`;
      await sendEmail(updatedClaim.admin.email, 'New claim assigned to you', message);
  
      res.status(200).json(updatedClaim);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.respondToClaim = async (req, res) => {
    try {
      const { claimId } = req.params;
      const { claimResponse } = req.body;
  
      const claim = await Claim.findByPk(claimId, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id','fullname','email', 'role']
          },
          {
            model: User,
            as: 'admin',
            attributes: ['id','fullname','email', 'role']
          }
        ]
      });
      if (!claim) return res.status(404).json({ error: 'Claim not found' });
  
      claim.claimResponse = claimResponse;
      claim.status = 'Treated';
      await claim.save();

      await notifyUser({
        userId: claim.creator.id,
        role: claim.creator.role,
        title: 'Votre réclamation est traité',
        message: `votre réclamation a été traité par ${claim.admin.fullname}`,
      }, req.app.get('io'));

      const message = `Hi ${claim.creator.fullname} You're claim has been Treated by the admin  ${claim.admin.fullname}`;
      await sendEmail(claim.creator.email, `You're claim has been Treated`, message);
      res.status(200).json(claim);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getUserClaims = async (req, res) => {
    try {
        const { id } = req.params;
  
      const claims = await Claim.findAll({
        where: { createdBy: id },
        include: [
          {
            model: User,
            as: 'admin',
            attributes: ['id','fullname','email']
          }
        ]
      });
      const count = await Claim.count({ where: { createdBy: id } });
  
      res.status(200).json({total :count, claims:claims});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  exports.getClaimsByAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      const claims = await Claim.findAll({
        where: { responsibleAdmin: id },
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'fullname', 'email']
          }
        ],
        order: [
          [
            Sequelize.literal(`
              CASE 
                WHEN priority = 'High' THEN 1
                WHEN priority = 'Average' THEN 2
                WHEN priority = 'Low' THEN 3
                ELSE 4
              END
            `),
            'ASC'
          ]
        ]
      });
  
      const count = await Claim.count({ where: { responsibleAdmin: id } });
      res.status(200).json({ total: count, claims: claims });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  exports.getAllClaims = async (req, res) => {
    try {
      const claims = await Claim.findAll({
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'fullname', 'email']
          },
          {
            model: User,
            as: 'admin',
            attributes: ['id', 'fullname', 'email']
          }
        ],
        order: [
          [
            Sequelize.literal(`
              CASE 
                WHEN priority = 'High' THEN 1
                WHEN priority = 'Average' THEN 2
                WHEN priority = 'Low' THEN 3
                ELSE 4
              END
            `),
            'ASC'
          ]
        ]
      });
  
      const count = await Claim.count();
      res.status(200).json({ total: count, claims: claims });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  
  

  
  
  