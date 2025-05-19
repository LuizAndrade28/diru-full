// app/frontend/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">
        Diru
      </Link>

      <div className="navbar-nav">
        <NavLink className="nav-link" to="/">
          Dashboard
        </NavLink>
        <NavLink className="nav-link" to="/gastos">
          Gastos
        </NavLink>
        <NavLink className="nav-link" to="/resumos">
          Resumos
        </NavLink>
      </div>

      <div className="ms-auto">
        {/* exemplo de link de perfil/sair */}
        <a className="btn btn-outline-secondary" href="/users/edit">
          Minha conta
        </a>
      </div>
    </nav>
  );
}
