import React, { createContext, useContext } from "react";
import aboutUsStore from "./AboutUsStore";
import contentSectionStore from "./ContentSectionStore";
import settingsStore from "./SettingsStore"
import serviceStore from "./ServiceStore";
import productStore from "./ProductStore";
import contactInformationStore from "./contactInformationStore"
import profileStore from "./ProfileStore"
import subscriptionStore from "./SubscriptionStore"
import invoiceStore from "./InvoiceStore"
import claimStore from "./ClaimStore"
import notificationStore from "./NotificationStore"

// Create a context with the stores
const StoreContext = createContext({
  aboutUsStore,
  contentSectionStore,
  settingsStore,
  serviceStore,
  contactInformationStore,
  productStore,
  profileStore,
  subscriptionStore,
  invoiceStore,
  claimStore,
  notificationStore
});

// Hook to use stores in components
export const useStores = () => useContext(StoreContext);

// Store Provider component
export const StoreProvider = ({ children }) => {
  return (
    <StoreContext.Provider value={{notificationStore, claimStore,invoiceStore,subscriptionStore,aboutUsStore,contentSectionStore,settingsStore,serviceStore,contactInformationStore, productStore, profileStore }}>
      {children}
    </StoreContext.Provider>
  );
};
