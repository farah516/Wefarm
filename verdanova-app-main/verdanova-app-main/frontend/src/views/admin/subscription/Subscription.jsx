import React, { useEffect, useState, useMemo, useCallback } from "react"
import Card from "components/card"
import axios from "axios"
import { useStores } from "stores/StoreProvider"
import { observer } from "mobx-react-lite"
import SubscriptionCard from "./SubscriptionCard"
import Modal from "components/modal/Modal"
import SubscriptionsForm from "./SubscriptionsForm"
import { MdAdd, MdArrowBack, MdArrowForward, MdSearch } from "react-icons/md"
import NoDataComponent from "components/dataComponent/NoDataComponent"
import clsx from "clsx"

const Subscription = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { subscriptionStore } = useStores()
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState("next")

  const filteredSubscriptions = useMemo(() => {
    const subs = subscriptionStore?.AllSubscription || []
    const term = searchTerm.toLowerCase()
    return subs.filter((subscription) => {
      const fullName = subscription?.user?.fullname?.toLowerCase() || ""
      const status = subscription?.status?.toLowerCase() || ""
      const paymentStatus = subscription?.paymentStatus?.toLowerCase() || ""
      const paymentMethod = subscription?.paymentMethod?.toLowerCase() || ""
      const price = subscription?.price?.toString() || ""
      return (
        fullName.includes(term) ||
        status.includes(term) ||
        paymentStatus.includes(term) ||
        paymentMethod.includes(term) ||
        price.includes(term)
      )
    })
  }, [subscriptionStore?.AllSubscription, searchTerm])
  
  useEffect(() => {
    const index = filteredSubscriptions.findIndex((_, i) => i >= currentPage * itemsPerPage && i < (currentPage + 1) * itemsPerPage)
    if (searchTerm && index === -1 && filteredSubscriptions.length > 0) {
      const newPage = Math.floor(0 / itemsPerPage)
      if (newPage !== currentPage) {
        setDirection("next")
        animatePage(() => setCurrentPage(newPage))
      }
    }
  }, [searchTerm, filteredSubscriptions, currentPage])

  const startIndex = currentPage * itemsPerPage
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage)

  const handleNext = () => {
    if (startIndex + itemsPerPage >= filteredSubscriptions.length || isAnimating) return
    setDirection("next")
    animatePage(() => setCurrentPage((prev) => prev + 1))
  }

  const handlePrev = () => {
    if (currentPage === 0 || isAnimating) return
    setDirection("prev")
    animatePage(() => setCurrentPage((prev) => prev - 1))
  }

  const animatePage = (callback) => {
    setIsAnimating(true)
    setTimeout(() => {
      callback()
      setIsAnimating(false)
    }, 300)
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/subscription/`)
      if (response.status === 200) {
        subscriptionStore.getSubscriptions(response.data.subscriptions)
      }
    } catch (err) {
      console.error("Error:", err)
    } finally {
      setLoading(false)
    }
  }, [subscriptionStore])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  

  const handleAddClick = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  return (
    <Card extra="relative w-full h-full p-3 mt-10 overflow-hidden">
      <div className="mx-4 mt-2 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Liste des abonnements
        </h2>
        <div className="flex flex-row gap-4">
          <button
            onClick={handleAddClick}
            className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-600 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20"
          >
            <div className="flex items-center">
              <MdAdd />
              <span className="ml-2">Ajouter</span>
            </div>
          </button>
        </div>
      </div>

      {/* Search input */}
      <div className="relative mx-4 my-4 w-full md:w-1/2">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <MdSearch size={20} />
        </span>
        <input
          type="text"
          placeholder="Rechercher par nom, statut, prix ou méthode de paiement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-b border-gray-300 bg-transparent text-sm text-gray-700 dark:text-white focus:outline-none focus:border-brand-500"
        />
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <>
          <div
            className={clsx(
              "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-300 ease-in-out",
              {
                "opacity-0 -translate-x-10": isAnimating && direction === "next",
                "opacity-0 translate-x-10": isAnimating && direction === "prev",
                "opacity-100 translate-x-0": !isAnimating,
              }
            )}
            key={currentPage}
          >
            {paginatedSubscriptions.map((subscription) => (
              <SubscriptionCard key={subscription.id} subscription={subscription} />
            ))}
          </div>

          {currentPage > 0 && (
            <MdArrowBack
              onClick={handlePrev}
              className="fixed left-200 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-4xl text-gray-600 hover:text-black transition-transform hover:scale-110"
            />
          )}
          {startIndex + itemsPerPage < filteredSubscriptions.length && (
            <MdArrowForward
              onClick={handleNext}
              className="fixed right-8 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-4xl text-gray-600 hover:text-black transition-transform hover:scale-110"
            />
          )}

          {filteredSubscriptions.length > 0 && (
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-white">
              Page {currentPage + 1} / {Math.ceil(filteredSubscriptions.length / itemsPerPage)}
            </div>
          )}
        </>
      )}

      {filteredSubscriptions.length === 0 && <NoDataComponent />}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={"Ajouter un nouveau abonnement"}
      >
        <SubscriptionsForm onClose={handleCloseModal} />
      </Modal>
    </Card>
  )
}

export default observer(Subscription)
