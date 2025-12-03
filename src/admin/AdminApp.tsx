// src/admin/AdminApp.tsx
import { Routes,Route,Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Orders from "./pages/Orders";
import Reviews from "./pages/Reviews";

export default function AdminApp(){
  const admin=localStorage.getItem("admin");

  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      
      <Route path="/dashboard" element={admin?<Dashboard/>:<Navigate to="/admin/login"/>}/>
      <Route path="/products"  element={admin?<Products/>:<Navigate to="/admin/login"/>}/>
      <Route path="/products/new" element={admin?<AddProduct/>:<Navigate to="/admin/login"/>}/>
      <Route path="/orders" element={admin?<Orders/>:<Navigate to="/admin/login"/>}/>
      <Route path="/reviews" element={admin?<Reviews/>:<Navigate to="/admin/login"/>}/>
    </Routes>
  );
}
