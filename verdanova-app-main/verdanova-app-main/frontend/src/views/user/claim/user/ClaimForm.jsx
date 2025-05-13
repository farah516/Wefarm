import React, {useState } from "react"
import { observer } from "mobx-react-lite"
import axios from "axios"
import { useStores } from "stores/StoreProvider"
import Select from 'react-select'

const ClaimForm = observer(({ onClose, claim }) => {
  const { claimStore } = useStores();
  const [errors, setErrors] = useState({});
  const [subject, setSubject] = useState(claim?.subject || null);
  const [type, setType] = useState(() => {
      if (claim?.type === 'TechnicalBug') {
        return { value: 'TechnicalBug', label: 'Bug technique' };
      } else if (claim?.type === 'Suggestion') {
        return { value: 'Suggestion', label: 'Suggestion' };
      } else if (claim?.type === 'RequestAssistance') {
        return { value: 'RequestAssistance', label: "Demande d'aide" };
      } else if (claim?.type === 'Other') {
        return { value: 'Other', label: "Autre" };
      } else {
        return null;
      }
    });

    const typeOptions = [
      { value: 'TechnicalBug', label: 'Bug technique' },
      { value: 'Suggestion', label: 'Suggestion' },
      { value: 'RequestAssistance', label: "Demande d'aide" },
      { value: 'Other', label: "Autre" }
      ];

      const handleChangeType = (selectedOption) => {
        setType(selectedOption);
      };

  const validate = () => {
    const newErrors = {};
    if (!subject) newErrors.subject = "Le sujet du réclamtion est requise";
    if (!type) newErrors.type = "Le type du réclamtion est requise";
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
      const id = localStorage.getItem('id');
      if (!id) {
        return;
      }
      const data = {
        subject:subject,
        type:type?.value,
      };

      if (claim) {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/claim/${claim.id}`,
          data
        );
        if (response.status === 200) {
          claimStore.editClaim(response.data.id, response.data);
          onClose(); 
          window.location.reload();
        }
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/claim/${id}`,
          data
        );
        if (response.status === 200) {
          claimStore.addClaim(response.data,id);
          onClose(); 
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while saving claim data:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}  className="max-h-[80vh] overflow-y-auto p-4">
      <div className="mb-4">
        <label
          htmlFor="subject"
          className="mb-2 block font-bold text-gray-900"
        >
          Le sujet de la réclamation
        </label>
        <textarea
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-gray-50 w-full rounded border py-2 px-3 shadow"
        />
         {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
      </div>
     
      <div className="mb-4">
        <label
          htmlFor="type"
          className="mb-2 block font-bold text-gray-900"
        >
          Sélectionnez un type de réclamation
        </label>
        <Select
        options={typeOptions}
        value={type}
        onChange={handleChangeType}
        getOptionLabel={option => option?.label}
        getOptionValue={option => option?.value}
        placeholder="Sélectionner un type de réclamation"
      />
       {errors.type && (
        <p className="text-red-500 text-sm mt-1">{errors.type}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="mr-2 rounded bg-gray-500 py-2 px-4 font-bold text-white hover:bg-gray-700"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </div>
    </form>
  );
});

export default ClaimForm;
