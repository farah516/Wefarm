import React from "react";
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/accounts";
import Profile from "views/admin/profile";
import ProductTable from "views/admin/product/product"; 
import Subscription from "views/admin/subscription/Subscription"; 
import Invoice from "views/admin/Invoice/Invoice"; 
import ClaimAdmin from "views/admin/claim/ClaimAdmin"; 
import { MdHome, MdPerson, MdBarChart, MdOutlineInsertDriveFile, MdAttachMoney, MdOutlineMessage } from "react-icons/md";


const superadminRoutes = [
  {
    name: "Main Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Admins",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdPerson className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Products",
    layout: "/admin",
    path: "product",
    icon: <MdBarChart className="h-6 w-6" />,
    component: <ProductTable />, 
  },
  {
    name: "Les abonnements",
    layout: "/admin",
    path: "subscription",
    icon: <MdOutlineInsertDriveFile className="h-6 w-6" />,
    component: <Subscription />, 
  },
  {
    name: "Les factures",
    layout: "/admin",
    path: "invoice",
    icon: <MdAttachMoney className="h-6 w-6" />,
    component: <Invoice />, 
  },
  {
    name: "Les reclamtions",
    layout: "/admin",
    path: "reclamtion",
    icon: <MdOutlineMessage className="h-6 w-6" />,
    component: <ClaimAdmin />, 
  }
];

export default superadminRoutes;
