import React, { useState } from "react"
import { useStores } from "stores/StoreProvider"
import { observer } from "mobx-react-lite"
import axios from "axios"
import ClaimForm from "./ClaimForm"
import DeleteModal from "../../../../components/modal/DeleteModal"
import Modal from "../../../../components/modal/Modal"

const ClaimCard = observer(({ claim }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { claimStore } = useStores(); 

  
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);
  const handleDeleteModal = () => setIsDeleteModalOpen(true);

  const deleteCard = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/claim/${claim.id}`);
      if (response.status === 200) {
        claimStore.removeClaim(claim?.id);
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Error while Deleting claim data:", err);
    }
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
  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={detailsStyle}>
        <h2 style={titleStyle}>Réclamation</h2>
        <p style={descriptionStyle}>Sujet de la réclamation :</p>
        <p style={descriptionStyle}>
        {claim.subject}
        </p>
        <p style={descriptionStyle}>Type du réclamation : <span style={badgeStyle}>{claim.type}</span></p>
        <p style={descriptionStyle}>Status du réclamation : <span style={badgeStyle}>{claim.status}</span></p>
        <p style={descriptionStyle}>
          Soumis le  : {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
        </p>
        {claim.admin && (
          <div>
              <hr />
              <h4 style={titleStyle}>Informations du responsable</h4>
              <p style={descriptionStyle}>Nom : {claim.admin.fullname} </p>
              <p style={descriptionStyle}>Email : {claim.admin.email} </p>
              {claim.claimResponse && (
                <p style={descriptionStyle}>Réponse : {claim.claimResponse}</p>
              )}
          </div>
          )}
        {claim.status !== "InProgress" && (
          <div style={footerStyle}>
            {(claim.status === "Untreated" || claim.status === "Treated") && (
              <button
                style={{
                  ...buttonDeleteStyle,
                  ...(isHovered ? buttonDeleteHoverStyle : {}),
                }}
                onClick={handleDeleteModal}
              >
                Supprimer
              </button>
            )}
            {claim.status === "Untreated" && (
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
            )}
          </div>
        )}

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={"Modifier une Reclamtion"}>
        <ClaimForm onClose={() => setIsModalOpen(false)} claim={claim} />
      </Modal>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title={'Supprimer une Reclamtion ?'}
      >
        {" "}
        <DeleteModal
          bodyModal="Êtes-vous sûr de vouloir supprimer cette reclamtion ?"
          onClose={handleCloseDeleteModal}
          handleDelete={deleteCard}
        />
      </Modal>
    </div>
  );
});

export default ClaimCard;
