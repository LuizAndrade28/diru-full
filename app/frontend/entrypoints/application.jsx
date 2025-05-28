import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "../src/i18n";

import Dashboard from "../components/Dashboard";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";

import { useCurrentUser } from "../src/hooks/auth";

// import ExpensesIndex from "../components/ExpensesIndex";
// import MonthlyReport from "../components/MonthlyReport";
// import "../styles/application.scss"; // opcional

function App() {
  const user = useCurrentUser();
  // if (!user) return null;

  /*  ⬇️  Três estados */
  if (user === undefined) return <Spinner />; // carregando
  if (user === false) return <Navigate to="/users/sign_in" replace />;

  /* logado */
  return (
    <BrowserRouter>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />

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
