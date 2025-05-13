import React, { useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import axios from "axios"
import { useStores } from "stores/StoreProvider"
import Select from 'react-select'

const SubscriptionsForm = observer(({ onClose, subscription }) => {
  const { subscriptionStore } = useStores(); 
  const formatDate = (date) => new Date(date).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(
    subscription?.startDate ? formatDate(subscription.startDate) : formatDate(new Date())
  );
  const [endDate, setEndDate] = useState(
    subscription?.endDate ? formatDate(subscription.endDate) : formatDate(new Date())
  );
  const [price, setPrice] = useState(subscription?.price || 0);
  const [userId, setUserId] = useState(subscription?.userId || 0);
  const [status, setStatus] = useState(() => {
    if (subscription?.status === 'Active') {
      return { value: 'Active', label: 'actif' };
    } else if (subscription?.status === 'Pending') {
      return { value: 'Pending', label: 'En attente' };
    } else if (subscription?.status === 'Expired') {
      return { value: 'Expired', label: 'Expiré' };
    } else {
      return null;
    }
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    if (subscription?.paymentMethod === 'Check') {
      return { value: 'Check', label: 'Chèque bancairee' }
    } else if (subscription?.paymentMethod === 'Transfer') {
      return  { value: 'Transfer', label: 'Virement bancaire' };
    } else if (subscription?.paymentMethod === 'cash') {
      return { value: 'cash', label: 'Espèces' };
    } else {
      return null;
    }
  });

  const [paymentStatus, setPaymentStatus] = useState(() => {
    if (subscription?.paymentStatus === 'Paid') {
      return { value: 'Paid', label: 'Payé' }
    } else if (subscription?.paymentStatus === 'Pending') {
      return  { value: 'Pending', label: 'En attente' };
    } else if (subscription?.paymentStatus === 'Late') {
      return { value: 'Late', label: 'En retard' };
    } else {
      return null;
    }
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!startDate) newErrors.startDate = "La date de début est requise";
    if (!endDate) newErrors.endDate = "La date de fin est requise";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.startDate = "La date de début doit être antérieure à la date de fin";
    }
    if (!price || price <= 0) newErrors.price = "Le prix doit être supérieur à 0";
    if (!subscription && !userId) newErrors.userId = "Veuillez sélectionner un utilisateur";
    if (!status) newErrors.status = "Le statut est requis";
    if (!paymentStatus) newErrors.paymentStatus = "Le statut de paiement est requis";
  
    const enabledPaymentStatuses = ['Paid'];
    if (enabledPaymentStatuses.includes(paymentStatus?.value || paymentStatus)) {
      if (!paymentMethod) newErrors.paymentMethod = "Le moyen de paiement est requis";
    }
  
    return newErrors;
  };
  

    const statusOptions = [
    { value: 'Active', label: 'actif' },
    { value: 'Pending', label: 'En attente' },
    { value: 'Expired', label: 'Expiré' }
    ];

    const paymentStatusOptions = [
        { value: 'Paid', label: 'Payé' },
        { value: 'Pending', label: 'En attente' },
        { value: 'Late', label: 'En retard' }
    ];

    const paymentMethodOptions = [
        { value: 'Check', label: 'Chèque bancairee' },
        { value: 'Transfer', label: 'Virement bancaire' },
        { value: 'cash', label: 'Espèces' }
    ];

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/users/users`)
      .then((response) => response.json())
      .then((data) => {
        const filtredusers = data.map((user) => ({
          value: user.id,
          label: user.fullname
        }));
        setUsers(filtredusers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (selectedOption) => {
    setUserId(selectedOption);
  };

  const handleChangeStatus = (selectedOption) => {
    setStatus(selectedOption);
  };

  const handleChangePaymentStatus = (selectedOption) => {
    setPaymentStatus(selectedOption);
  };

  const handleChangePaymentMethod = (selectedOption) => {
    setPaymentMethod(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const data = {
        startDate,
        endDate,
        price,
        userId:userId?.value,
        paymentMethod:paymentMethod?.value,
        paymentStatus:paymentStatus?.value,
        status:status?.value
      };

      if (subscription) {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/subscription/${subscription.id}`,
          data
        );
        if (response.status === 200) {
        subscriptionStore.editSubscription(response.data.id, response.data);
          onClose(); 
          window.location.reload();
        }
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/subscription/`,
          data
        );
        if (response.status === 200) {
            subscriptionStore.addSubscription(response.data,localStorage.getItem('id'));
          onClose(); 
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while saving subscription data:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}  className="max-h-[80vh] overflow-y-auto p-4">
      <div className="mb-4">
        <label htmlFor="startDate" className="mb-2 block font-bold text-gray-900">
          Date de début
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-gray-50 w-full rounded border py-2 px-3 shadow"
        />
         {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
            )}
      </div>
      <div className="mb-4">
        <label htmlFor="endDate" className="mb-2 block font-bold text-gray-900">
          Date de fin
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-gray-50 w-full rounded border py-2 px-3 shadow"
        />
         {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="price" className="mb-2 block font-bold text-gray-900">
            Prix
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-50 w-full rounded border py-2 px-3 shadow"
        />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>
     
      {!subscription && (
        <div className="mb-4">
            <label htmlFor="userId" className="mb-2 block font-bold text-gray-900">
            Sélectionner un utilisateur
            </label>
            <Select
            options={users}
            value={userId}
            isLoading={loading}
            onChange={handleChange}
            getOptionLabel={(option) => option?.label}
            getOptionValue={(option) => option?.value}
            placeholder="Sélectionner un utilisateur"
            />
            {errors.userId && (
            <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
            )}
        </div>
        )}


      <div className="mb-4">
        <label
          htmlFor="status"
          className="mb-2 block font-bold text-gray-900"
        >
          Sélectionnez un statut d'abonnement
        </label>
        <Select
        options={statusOptions}
        value={status}
        isLoading={loading}
        onChange={handleChangeStatus}
        getOptionLabel={option => option?.label}
        getOptionValue={option => option?.value}
        placeholder="Sélectionner un statu d'abonnement"
      />
       {errors.status && (
        <p className="text-red-500 text-sm mt-1">{errors.status}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="paymentStatus"
          className="mb-2 block font-bold text-gray-900"
        >
          Sélectionnez un statut de paiement
        </label>
        <Select
        options={paymentStatusOptions}
        value={paymentStatus}
        isLoading={loading}
        onChange={handleChangePaymentStatus}
        getOptionLabel={option => option?.label}
        getOptionValue={option => option?.value}
        placeholder="Sélectionner un statu de paiement"
      />
       {errors.paymentStatus && (
        <p className="text-red-500 text-sm mt-1">{errors.paymentStatus}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="paymentMethod"
          className="mb-2 block font-bold text-gray-900"
        >
          Sélectionnez un methode paiement
        </label>
        <Select
          options={paymentMethodOptions}
          value={paymentMethod}
          isDisabled={!['Paid'].includes(paymentStatus?.value || paymentStatus)}
          isLoading={loading}
          onChange={handleChangePaymentMethod}
          getOptionLabel={option => option?.label}
          getOptionValue={option => option?.value}
          placeholder="Sélectionner un moyen de paiement"
        />

        {errors.paymentMethod && (
        <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
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

export default SubscriptionsForm;
