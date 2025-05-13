import React, { useState } from "react"
import { useStores } from "stores/StoreProvider"
import { observer } from "mobx-react-lite"
import axios from "axios"
import Modal from "components/modal/Modal"

const ClaimCard = observer(({ claim }) => {
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [claimResponse, setClaimResponse] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState({});
  const { claimStore } = useStores(); 

  
  const handleCloseAnswerModal = () => setIsAnswerModalOpen(false);
  const handleAnswerModal = () => setIsAnswerModalOpen(true);
  const validate = () => {
    const newErrors = {};
    if (!claimResponse) newErrors.claimResponse = "La reponse du reclamtion est requise";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/claim/${claim.id}/respond`, { claimResponse });
      if (response.status === 200) {
        claimStore.editClaim(response.data.id, response.data);
        setIsAnswerModalOpen(false);
        window.location.reload();
      }
    }catch (err) {
      console.error("Error while saving claim answer data:", err);
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

  const badgeStyleHigh = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'red',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginRight: '8px',
    marginBottom: '5px',
  };

  const badgeStyleAverage = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'yellow',
    color: '#fff',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginRight: '8px',
    marginBottom: '5px',
  };

  const badgeStyleLow = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'gris',
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

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'High':
        return badgeStyleHigh;
      case 'Average':
        return badgeStyleAverage;
      case 'Low':
        return badgeStyleLow;
      default:
        return badgeStyle;
    }
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
        <p style={descriptionStyle}>
          priorité : <span style={getPriorityBadgeStyle(claim.priority)}>{claim.priority}</span>
        </p>

        <hr />
        <h4 style={titleStyle}>Informations du utulisateur</h4>
        <p style={descriptionStyle}>Nom : {claim.creator.fullname} </p>
        <p style={descriptionStyle}>Email : {claim.creator.email} </p>
        {claim.claimResponse && (
          <p style={descriptionStyle}>Votre Réponse : {claim.claimResponse}</p>
         )}
        
        {claim.status === "InProgress" && (
          <div style={footerStyle}>
              <button
                style={{
                  ...buttonDeleteStyle,
                  ...(isHovered ? buttonDeleteHoverStyle : {}),
                }}
                onClick={handleAnswerModal}
              >
                Repondre
              </button>
          </div>
        )}

      </div>

      <Modal
        isOpen={isAnswerModalOpen}
        onClose={handleCloseAnswerModal}
        title={'Repondre à la réclamation'}
      >
         <form onSubmit={handleSubmit}  className="max-h-[80vh] overflow-y-auto p-4">
          <div className="mb-4">
            <label
              htmlFor="claimResponse"
              className="mb-2 block font-bold text-gray-900"
            >
              Réponse de la réclamation
            </label>
            <textarea
              id="claimResponse"
              value={claimResponse}
              onChange={(e) => setClaimResponse(e.target.value)}
              className={`w-full p-2 border rounded ${errors.answer ? "border-red-500" : "border-gray-300"}`}
            ></textarea>
            {errors.claimResponse && <p className="text-red-500">{errors.claimResponse}</p>}
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Envoyer</button>
          <button type="button" onClick={handleCloseAnswerModal} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Annuler</button>
         </form>
      
      </Modal>
    </div>
  );
});

export default ClaimCard;
