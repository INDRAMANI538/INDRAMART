import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Categories from "./components/Categories";
import CustomerCare from "./components/CustomerCare";

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/:categoryId" element={<Categories />} />
        <Route path="/customer-care" element={<CustomerCare />} />
      </Routes>
    </div>
  );
}
