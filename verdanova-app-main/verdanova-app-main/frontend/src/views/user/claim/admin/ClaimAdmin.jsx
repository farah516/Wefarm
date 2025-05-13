import React, { useEffect, useState, useMemo, useCallback } from "react"
import Card from "components/card"
import axios from "axios"
import { useStores } from "stores/StoreProvider"
import { observer } from "mobx-react-lite"
import ClaimCard from "./ClaimCard"
import { MdArrowBack, MdArrowForward } from "react-icons/md"
import NoDataComponent from "components/dataComponent/NoDataComponent"
import clsx from "clsx"

const ClaimAdmin = () => {
  const [loading, setLoading] = useState(false)
  const { claimStore } = useStores()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState("next")

   const filteredClaims = useMemo(() => {
          const claims = claimStore?.AdminClaims || []
          const term = searchTerm.toLowerCase()
          return claims.filter((claim) => {
            const type = claim?.type.toLowerCase() || ""
            const status = claim?.status.toLowerCase() || ""
            const priority = claim?.priority.toLowerCase() || ""
            const fullname = claim?.creator?.fullname.toLowerCase() || ""
            return (
              type.includes(term) ||
              status.includes(term) ||
              priority.includes(term) ||
              fullname.includes(term) 
            )
          })
        }, [claimStore?.AdminClaims, searchTerm])
  
    useEffect(() => {
      const index = filteredClaims.findIndex((_, i) => i >= currentPage * itemsPerPage && i < (currentPage + 1) * itemsPerPage)
      if (searchTerm && index === -1 && filteredClaims.length > 0) {
        const newPage = Math.floor(0 / itemsPerPage)
      if (newPage !== currentPage) {
        setDirection("next")
        animatePage(() => setCurrentPage(newPage))
      }
      }
    }, [searchTerm, filteredClaims, currentPage])
  
    const startIndex = currentPage * itemsPerPage
    const paginatedClaims = filteredClaims.slice(startIndex, startIndex + itemsPerPage)
  
    const handleNext = () => {
      if (startIndex + itemsPerPage >= filteredClaims.length || isAnimating) return
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
        const id = localStorage.getItem("id")
        setLoading(true)
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/claim/admin/${id}`)
        if (response.status === 200) {
          claimStore.getAdminClaims(response.data.claims)
        }
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }, [claimStore])
    
    useEffect(() => {
      fetchData()
    }, [fetchData])


  return (
    <Card extra="relative w-full h-full p-3 mt-10 overflow-hidden">
      <div className="mx-4 mt-2 mb-8 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Liste des Réclamations
        </h2>
      </div>

      <input
          type="text"
          placeholder="Rechercher par nom du utulisateur, priorité, type ou statu du reclamtion..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border-b border-gray-300 bg-transparent text-sm text-gray-700 dark:text-white focus:outline-none focus:border-brand-500"
        />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Animated container */}
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
            {paginatedClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>

          {/* Fixed navigation arrows */}
          {currentPage > 0 && (
            <MdArrowBack
              onClick={handlePrev}
              className="fixed left-200 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-4xl text-gray-600 hover:text-black transition-transform hover:scale-110"
            />
          )}
          {startIndex + itemsPerPage < filteredClaims.length && (
            <MdArrowForward
              onClick={handleNext}
              className="fixed right-8 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-4xl text-gray-600 hover:text-black transition-transform hover:scale-110"
            />
          )}

          {/* Page number at bottom */}
          {filteredClaims.length !== 0 && 
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-white">
            Page {currentPage + 1} / {Math.ceil(filteredClaims.length / itemsPerPage)}
          </div>
          }
        </>
      )}

      {filteredClaims.length === 0 && <NoDataComponent />}
    </Card>
  )
}

export default observer(ClaimAdmin)
