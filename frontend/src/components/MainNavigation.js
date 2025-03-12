import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Search, Briefcase } from "react-feather";
import "./MainNavigation.css";

const MainNavigation = ({ setActivePatient }) => {
  return (
    <nav className="nav-container">
      <NavLink to="/calendar" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setActivePatient(null)}>
        <span className="nav-icon"><Calendar size={24} /></span>
        <span className="nav-label">Calendrier</span>
      </NavLink>

      <NavLink to="/services" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setActivePatient(null)}>
        <span className="nav-icon"><Briefcase size={24} /></span>
        <span className="nav-label">Services</span>
      </NavLink>

      <NavLink to="/search" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} onClick={() => setActivePatient(null)}>
        <span className="nav-icon"><Search size={24} /></span>
        <span className="nav-label">Recherche</span>
      </NavLink>
    </nav>
  );
};

export default MainNavigation;
