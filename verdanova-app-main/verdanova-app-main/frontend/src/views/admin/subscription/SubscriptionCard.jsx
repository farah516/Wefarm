import React, { useState } from "react"
import { useStores } from "stores/StoreProvider"
import { observer } from "mobx-react-lite"
import axios from "axios"
import SubscriptionsForm from "./SubscriptionsForm"
import DeleteModal from "../../../components/modal/DeleteModal"
import Modal from "components/modal/Modal"

const SubscriptionCard = observer(({ subscription }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { subscriptionStore } = useStores(); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

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

  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const priceStyle = {
    fontSize: "1.125rem",
    fontWeight: "700",
  };

  const buttonDeleteStyle = {
    backgroundColor: "#f53939",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonDeleteHoverStyle = {
    backgroundColor: "#ea0606",
  };

  const buttonStyle = {
    backgroundColor: "#82d616",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const buttonHoverStyle = {
    backgroundColor: "#65a30d",
  };
  

  const deleteCard = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/subscription/${subscription.id}`
      );
      if (response.status === 200) {
        subscriptionStore.removeSubscription(subscription?.id);
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Error while Deleting subscription data:", err);
    }
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={detailsStyle}>
        <h2 style={titleStyle}>Propriétaire de l'abonnement : {subscription.user.fullname}</h2>
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
        <div style={footerStyle}>
          <button
            style={{
              ...buttonDeleteStyle,
              ...(isHovered ? buttonDeleteHoverStyle : {}),
            }}
            onClick={handleDeleteModal}
          >
            Supprimer
          </button>
          <button
            style={{
              ...buttonStyle,
              ...(isHovered ? buttonHoverStyle : {}),
            }}
            onClick={() => {
                setIsModalOpen(true);
            }}
          >
            Modifier
          </button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={"Modifier un abonnement"}>
        <SubscriptionsForm onClose={() => setIsModalOpen(false)} subscription={subscription} />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title={'Supprimer Cette abonnement ?'}
      >
        {" "}
        <DeleteModal
          bodyModal="Êtes-vous sûr de vouloir supprimer cette abonnement ?"
          onClose={handleCloseDeleteModal}
          handleDelete={deleteCard}
        />
      </Modal>
    </div>
  );
});

export default SubscriptionCard;
