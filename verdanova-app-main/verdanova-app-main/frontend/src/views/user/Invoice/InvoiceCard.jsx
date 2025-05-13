import React, { useState } from "react"
import { observer } from "mobx-react-lite"
import axios from "axios"
import Modal from "components/modal/Modal"

const InvoiceCard = observer(({ invoice }) => {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const totalPrice = invoice?.subscriptions.reduce((acc, sub) => acc + parseFloat(sub.price), 0) || 0;

  const handleClosePdfModal = () => setIsPdfModalOpen(false);

  const pdfCard = async () => {
    try {
      setIsPdfLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/invoice/pdf/${invoice.id}`,
        { responseType: 'blob' }
      );
      if (response.status === 200) {
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        setPdfUrl(fileURL);
        setIsPdfModalOpen(true);
      }
    } catch (err) {
      console.error("Error while getting invoice PDF:", err);
    } finally {
      setIsPdfLoading(false); 
    }
  };

  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `facture_${invoice.invoiceNumber}.pdf`;
    link.click();
  };

  const loaderStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    fontSize: "1.2rem",
    color: "#004aad",
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
        <h2 style={titleStyle}> La réference du facture : {invoice.invoiceNumber}</h2>
        <p style={descriptionStyle}>
            Le prix totale du facture : {totalPrice}
        </p>
        <h4 style={titleStyle}>Les abonnements lié au facture</h4>
        {invoice.subscriptions.map((sub) => 
          <div key={sub.id} style={descriptionStyle}>
             <p style={descriptionStyle}>
                Date Début : {new Date(sub.startDate).toLocaleDateString('fr-FR')}
              </p>
              <p style={descriptionStyle}>
                  Date Fin : {new Date(sub.endDate).toLocaleDateString('fr-FR')}
              </p>
              <p style={priceStyle}>Prix :{sub.price}</p>
              <p style={descriptionStyle}>Statut de l'abonnement : <span style={badgeStyle}>{sub.status}</span></p>
              {sub.paymentMethod && (
                  <p style={descriptionStyle}>Méthode de paiement : <span style={badgeStyle}>{sub.paymentMethod}</span></p>
              )}
               <p style={descriptionStyle}>Statut du paiement : <span style={badgeStyle}>{sub.paymentStatus}</span></p>
               <hr/>
          </div>
        )}
        <div style={footerStyle}>
          <button
            style={{ ...buttonStyle, ...(isHovered ? buttonHoverStyle : {}), marginLeft: '8px' }}
            onClick={pdfCard}
          >
            Voir PDF
          </button>
        </div>
      </div>
      <Modal isOpen={isPdfModalOpen} onClose={handleClosePdfModal} title="Aperçu de la facture PDF">
        {pdfUrl && (
          <div>
            <iframe src={pdfUrl} width="100%" height="500px" title="Facture PDF" />
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <button onClick={handleClosePdfModal} style={{ marginRight: '10px', ...buttonDeleteStyle }}>Fermer</button>
              <button onClick={downloadPdf} style={buttonStyle}>Télécharger PDF</button>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={isPdfLoading}  title="loaading PDF" >
        {isPdfLoading ? (
          <div style={loaderStyle}>Chargement du PDF...</div>
        ) : (
          <div style={loaderStyle}>Erreur lors du chargement du PDF</div>
          )}
        </Modal>

    </div>
  );
});

export default InvoiceCard;
