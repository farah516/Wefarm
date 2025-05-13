import React from "react"
import { observer } from "mobx-react-lite"


const SubscriptionCard = observer(({ subscription }) => {
 const [isHovered, setIsHovered] = React.useState(false);
  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    width: "100%",
    maxWidth: "300px",
    margin: "auto",
  };
  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: '#004aad',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginRight: '8px',
    marginBottom: '5px',
  };
  const detailsStyle = {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };

  const titleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "8px",
  };

  const descriptionStyle = {
    fontSize: "0.875rem",
    color: "#555",
    marginBottom: "16px",
  };

  const priceStyle = {
    fontSize: "1.125rem",
    fontWeight: "700",
  };

 
  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={detailsStyle}>
        <h2 style={titleStyle}>Abonnement</h2>
        <p style={descriptionStyle}>
            Date Début : {new Date(subscription.startDate).toLocaleDateString('fr-FR')}
        </p>
        <p style={descriptionStyle}>
            Date Fin : {new Date(subscription.endDate).toLocaleDateString('fr-FR')}
        </p>
        <p style={priceStyle}>Prix :{subscription.price}</p>
        <p style={descriptionStyle}>Statut de l'abonnement : <span style={badgeStyle}>{subscription.status}</span></p>
        {subscription.paymentMethod && (
            <p style={descriptionStyle}>Méthode de paiement : <span style={badgeStyle}>{subscription.paymentMethod}</span></p>
        )}
        <p style={descriptionStyle}>Statut du paiement : <span style={badgeStyle}>{subscription.paymentStatus}</span></p>
      </div>
    </div>
  );
});

export default SubscriptionCard;
