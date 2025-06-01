import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Categories from "./components/Categories";
import CustomerCare from "./components/CustomerCare";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories/:categoryId" element={<Categories />} />
        <Route path="/customer-care" element={<CustomerCare />} />
      </Routes>
      <Footer />
    </>
  );
}
