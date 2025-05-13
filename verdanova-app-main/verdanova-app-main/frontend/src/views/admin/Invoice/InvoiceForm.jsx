import React, { useEffect, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import axios from "axios"
import { useStores } from "stores/StoreProvider"
import Select from 'react-select'
import { MdDeleteForever } from "react-icons/md"

const InvoiceForm = observer(({ onClose, invoice }) => {
  const { invoiceStore } = useStores(); 
  const formatDate = (date) => new Date(date).toISOString().split('T')[0];
  const [invoiceNumber, setInvoiceNumber] = useState(invoice?.invoiceNumber || null);
  const [userId, setUserId] = useState(invoice?.client.id || 0);
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscriptionsIds, setSubscriptionsIds] = useState(() => {
   if (invoice?.subscriptions && invoice?.subscriptions.length > 0) {
      return invoice.subscriptions.map((sub) => ({
        id: sub.id,
        label: formatDate(sub.startDate) + " - " + formatDate(sub.endDate) + " ( " + sub.price + " ) "
      }));}
      else return [];
    });
  const [chosenSubscription, setChosenSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: 'gris',
    color: 'black',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    marginRight: '8px',
    marginBottom: '5px',
  };
  const validate = () => {
    const newErrors = {};
    if (!invoiceNumber) newErrors.invoiceNumber = "La refrence du facture est requise";
    if (!invoice && !userId) newErrors.userId = "Veuillez sélectionner un utilisateur";
    if (subscriptionsIds.length===0) newErrors.subscriptionsIds = "Veuillez sélectionner au moins un  abonement";
    return newErrors;
  };

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

  const fetchSubscriptions = useCallback(async (id) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/subscription/user/notTreatedSubs/${id}`
      )
      if (response.status === 200) {
        const filtredSubscriptions = response.data.subscriptions.map((subscription) => ({
          value: subscription.id,
          label:
            formatDate(subscription.startDate) +
            " - " +
            formatDate(subscription.endDate) +
            " ( " +
            subscription.price +
            " ) ",
        }))
        setSubscriptions(filtredSubscriptions)
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }, [])
  
  useEffect(() => {
    if (userId) {
      fetchSubscriptions(userId)
    } else {
      setSubscriptions([])
    }
  }, [userId, fetchSubscriptions])
  
  const handleChange = async (selectedOption) => {
    setUserId(selectedOption);
    await fetchSubscriptions(selectedOption.value);
  };

  const handleChangeSubscription = (selectedOption) => {
    setChosenSubscription(selectedOption);
    setSubscriptions(subscriptions.filter(sub => sub.value !== selectedOption.value));
    const selectedSub = subscriptions.find(sub => sub.value === selectedOption.value);
    const newSub = {
      id: selectedSub.value,
      label: selectedSub.label
    };

    setSubscriptionsIds((prev) => [...prev, newSub]);
  };
  const removeSubscription = (id) => {
    const sub = subscriptionsIds.find((r) => r.id === id);
    if (sub) {
      const removedSub={
        value: sub.id,
        label: sub.label
      }
      setSubscriptions((prev) => [...prev, removedSub]);
    }
    setSubscriptionsIds(subscriptionsIds.filter((r) => r.id !== id))
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      let ids=[];
      subscriptionsIds.forEach((sub) => {
        ids.push(sub.id)  
      });
      const data = {
        invoiceNumber:invoiceNumber,
        userId:userId?.value,
        invoiceDate:new Date(),
        subscriptionIds:ids,
      };

      if (invoice) {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/invoice/${invoice.id}`,
          data
        );
        if (response.status === 200) {
          invoiceStore.editInvoice(response.data.id, response.data,localStorage.getItem('id'));
          onClose(); 
          window.location.reload();
        }
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/invoice/`,
          data
        );
        if (response.status === 200) {
          invoiceStore.addInvoice(response.data,localStorage.getItem('id'));
          onClose(); 
          window.location.reload();
        }
      }
    } catch (err) {
      console.error("Error while saving invoice data:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}  className="max-h-[80vh] overflow-y-auto p-4">
      <div className="mb-4">
        <label htmlFor="invoiceNumber" className="mb-2 block font-bold text-gray-900">
         La refrence du facture
        </label>
        <input
          type="text"
          id="invoiceNumber"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="bg-gray-50 w-full rounded border py-2 px-3 shadow"
        />
         {errors.invoiceNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.invoiceNumber}</p>
            )}
      </div>
     
      {!invoice && (
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
          htmlFor="subscriptionsIds"
          className="mb-2 block font-bold text-gray-900"
        >
          Sélectionnez un abonnement
        </label>
        <Select
        options={subscriptions}
        value={chosenSubscription}
        isLoading={loading}
        isDisabled={!userId}
        onChange={handleChangeSubscription}
        getOptionLabel={option => option?.label}
        getOptionValue={option => option?.value}
        placeholder="Sélectionner un abonnement"
      />
       {errors.subscriptionsIds && (
        <p className="text-red-500 text-sm mt-1">{errors.subscriptionsIds}</p>
        )}
      </div>
      {subscriptionsIds.map((sub) =>
        <div className="mb-4" key={sub.id}>
       <button
          type="button"
          style={{ ...badgeStyle, cursor: 'pointer', backgroundColor: '#f1f1f1', border: 'none' }}
          onClick={() => removeSubscription(sub.id)}
        >
          {sub.label} <MdDeleteForever style={{ display: "inline", color: "red" }} />
        </button>
        </div>
      )}
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

export default InvoiceForm;
