import React from "react";
import InviteUser from "views/admin/accounts/ajoutadmin";
import EditAdmin from "views/admin/accounts/editadmin";
import AddProduct from "views/admin/tables/AddProduct";

const Adminroutes = [
  {
    name: "Invite User",
    layout: "/admin",
    path: "accounts/ajoutadmin",
    component: <InviteUser />,
  },
  {
    name: "Edit Admin",
    layout: "/admin",
    path: "accounts/editadmin/:id",
    component: <EditAdmin />,
  },
  {
    name: "Add Product",
    layout: "/admin",
    path: "tables/addproduct",
    component: <AddProduct />,
  }
  // Add other routes here
];

export default Adminroutes;
