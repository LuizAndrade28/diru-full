import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "../src/i18n";

import Dashboard from "../components/Dashboard";
// import ExpensesIndex from "../components/ExpensesIndex";
// import MonthlyReport from "../components/MonthlyReport";
import Navbar from "../components/Navbar";

// import "../styles/application.scss"; // opcional

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/gastos" element={<ExpensesIndex />} />
        <Route path="/resumos" element={<MonthlyReport />} /> */}
        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const el = document.getElementById("root");
if (el) createRoot(el).render(<App />);
