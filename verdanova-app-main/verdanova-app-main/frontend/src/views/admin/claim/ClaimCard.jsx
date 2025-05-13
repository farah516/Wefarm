import React, { useState, useEffect } from "react"
import { useStores } from "stores/StoreProvider"
import { observer } from "mobx-react-lite"
import axios from "axios"
import Select from 'react-select'
import Modal from "components/modal/Modal"

const ClaimCard = observer(({ claim }) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [errors, setErrors] = useState({});
  const { claimStore } = useStores(); 
  const [users, setUsers] = useState([]);
  const [admin, setAdmin] = useState(() => {
    if (claim?.admin && claim?.admin !== null) {
      return { value: claim.admin.id, label: claim.admin.fullname };
    } else {
      return null;
    }
  });
  const [priority, setPriority] = useState(() => {
    if (claim?.priority === 'High') {
      return { value: 'High', label: 'Haut' };
    } else if (claim?.priority === 'Average') {
      return { value: 'Average', label: 'Moyenne' };
    } else if (claim?.priority === 'Low') {
      return { value: 'Low', label: "Faible" };
    } else {
      return null;
    }
});
    
  const priorityOptions = [
    { value: 'High', label: 'Haut' },
    { value: 'Average', label: 'Moyenne' },
    { value: 'Low', label: "Faible" }
  ];
    
  const handleChangePriority = (selectedOption) => {
    setPriority(selectedOption);
  };
  const handleChangeAdmin = (selectedOption) => {
    setAdmin(selectedOption);
  };

  
  const handleCloseAssignModal = () => setIsAssignModalOpen(false);
  const handleCloseLoadingModal = () => setIsLoadingModalOpen(false);
  const handleAssignModal = () => setIsAssignModalOpen(true);
  const validate = () => {
    const newErrors = {};
    if (!admin) newErrors.admin = "Le responsable est requise";
    if (!priority) newErrors.priority = "La priorité est requise";
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
      setIsLoadingModalOpen(true);
      const claimId = claim.id;
      const adminId = admin.value;
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/claim/assign`, { claimId, adminId, priority: priority.value });
      if (response.status === 200) {
        claimStore.editClaim(response.data.id, response.data);
        setIsLoadingModalOpen(false);
        setIsAssignModalOpen(false);
        window.location.reload();
      }
    }catch (err) {
      console.error("Error while assignig a responsible to a claim :", err);
    }
  };

  useEffect(() => {
    setIsLoadingModalOpen(true);
      fetch(`${process.env.REACT_APP_BACKEND_URL}/users/admins`)
        .then((response) => response.json())
        .then((data) => {
          const filtredusers = data.map((user) => ({
            value: user.id,
            label: user.fullname
          }));
          setUsers(filtredusers);
          setIsLoadingModalOpen(false);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          setIsLoadingModalOpen(false);
        });
    }, []);

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
  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    fontSize: "1.2rem",
    color: "#004aad",
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
    backgroundColor: '#808080',
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

        {claim.admin && (
          <div>
            <hr />
            <h4 style={titleStyle}>Informations du responsable</h4>
            <p style={descriptionStyle}>Nom : {claim.admin.fullname} </p>
            <p style={descriptionStyle}>Email : {claim.admin.email} </p>
          </div>
         )}
        
        {claim.status !== "Treated" && (
          <div style={footerStyle}>
              <button
                style={{
                  ...buttonDeleteStyle,
                  ...(isHovered ? buttonDeleteHoverStyle : {}),
                }}
                onClick={handleAssignModal}
              >
                Attribuer un responsable
              </button>
          </div>
        )}

      </div>

      <Modal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        title={'Assigner un responsable au reclamation'}
      >
         <form onSubmit={handleSubmit}  className="max-h-[80vh] overflow-y-auto p-4">
          <div className="mb-4">
              <label htmlFor="admin" className="mb-2 block font-bold text-gray-900">
              Sélectionner un responsable
              </label>
              <Select
              options={users}
              value={admin}
              onChange={handleChangeAdmin}
              getOptionLabel={(option) => option?.label}
              getOptionValue={(option) => option?.value}
              placeholder="Sélectionner un responsable"
              />
              {errors.admin && (
              <p className="text-red-500 text-sm mt-1">{errors.admin}</p>
              )}
          </div>
          <div className="mb-4">
              <label
                htmlFor="priority"
                className="mb-2 block font-bold text-gray-900"
              >
                Sélectionnez la priorité de réclamation
              </label>
              <Select
              options={priorityOptions}
              value={priority}
              onChange={handleChangePriority}
              getOptionLabel={option => option?.label}
              getOptionValue={option => option?.value}
              placeholder="Sélectionner la priorité de réclamation"
            />
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">{errors.priority}</p>
              )}
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enregistrer</button>
            <button type="button" onClick={handleCloseAssignModal} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Annuler</button>
         </form>
      </Modal>
       <Modal isOpen={isLoadingModalOpen} onClose={handleCloseLoadingModal}  title="Loading" >
        <div style={loaderStyle}>Chargement ...</div>
      </Modal>
    </div>
  );
});

export default ClaimCard;
