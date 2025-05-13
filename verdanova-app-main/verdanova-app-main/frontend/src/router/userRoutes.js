import React from "react";
import Profile from "views/admin/profile";
import AboutUs from "views/user/aboutUs/aboutUs";
import {
  MdPerson,
  MdOutlineMiscellaneousServices,
  MdOutlineProductionQuantityLimits,
  MdOutlinePeopleAlt,
  MdDriveFileRenameOutline,
  MdCleanHands,
  MdContacts,
  MdOutlineInsertDriveFile ,
  MdAttachMoney,
  MdOutlineMessage
} from "react-icons/md";
import ContentSection from "views/user/contentSection/contentSection";
import Settings from "views/user/settings/settings";
import Services from "views/user/services/index";
import Products from "views/user/products/index";
import Subscription from "views/user/subscription/Subscription";
import AdminSubscription from "views/admin/subscription/Subscription";
import ContactInformation from "views/user/contactInformation/contactInformation";
import Invoice from "views/admin/Invoice/Invoice"; 
import InvoiceUser from "views/user/Invoice/InvoiceUser"; 
import ClaimAdmin from "views/user/claim/admin/ClaimAdmin"; 
import Claim from "views/user/claim/user/Claim"; 
const role = localStorage.getItem("role");
const userRoutes = [
  // {
  //   name: "Main Dashboard",
  //   layout: "/admin",
  //   path: "default",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <MainDashboard />,
  // },

  // {
  //   name: "Productss",
  //   layout: "/admin",
  //   path: "data-tables",
  //   icon: <MdBarChart className="h-6 w-6" />,
  //   component: <DataTables />,
  // },
  {
    name: "Mon Compte",
    layout: "/user",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Qui sommes-nous",
    layout: "/user",
    path: "aboutus",
    icon: <MdOutlinePeopleAlt className="h-6 w-6" />,
    component: <AboutUs />,
  },
  {
    name: "Contenu de Section",
    layout: "/user",
    path: "content-section",
    icon: <MdDriveFileRenameOutline className="h-6 w-6" />,
    component: <ContentSection />,
  },
  {
    name: "Paramètres",
    layout: "/user",
    path: "Settings",
    icon: <MdOutlineMiscellaneousServices className="h-6 w-6" />,
    component: <Settings />,
  },
  {
    name: "Produits",
    layout: "/user",
    path: "products",
    icon: <MdOutlineProductionQuantityLimits className="h-6 w-6" />,
    component: <Products />,
  },
  {
    name: "Services",
    layout: "/user",
    path: "services",
    icon: <MdCleanHands className="h-6 w-6" />,
    component: <Services />,
  },
  {
    name: "Informations de contact",
    layout: "/user",
    path: "ContactInformation",
    icon: <MdContacts className="h-6 w-6" />,
    component: <ContactInformation />,
  },
  {
    name: "Les abonnements",
    layout: role === "admin" ? "/admin" : "/user",
    path: "subscription",
    icon: <MdOutlineInsertDriveFile className="h-6 w-6" />,
    component: role === "admin" ? <AdminSubscription /> : <Subscription />,
  },
  {
    name: "Les factures",
    layout: role === "admin" ? "/admin" : "/user",
    path: "invoice",
    icon: <MdAttachMoney className="h-6 w-6" />,
    component: role === "admin" ? <Invoice /> : <InvoiceUser />,
  },
  {
    name: "Les reclamtions",
    layout: role === "admin" ? "/admin" : "/user",
    path: "reclamtion",
    icon: <MdOutlineMessage className="h-6 w-6" />,
    component: role === "admin" ? <ClaimAdmin /> : <Claim />,
  },
];

export default userRoutes;
