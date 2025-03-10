import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

const MainNavigation = () => {
  return (
    <nav className="main-navigation">
      {/* 📌 Onglets principaux */}
      <NavLink to="/calendar" className="nav-item" activeclassname="active">
        📅 Calendrier
      </NavLink>
      <NavLink to="/services" className="nav-item" activeclassname="active">
        🏥 Services
      </NavLink>
      <NavLink to="/search" className="nav-item" activeclassname="active">
        🔎 Recherche patient
      </NavLink>
    </nav>
  );
};

export default MainNavigation;
