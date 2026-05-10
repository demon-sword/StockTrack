import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import JobWorkers from './pages/JobWorkers';
import Polishers from './pages/Polishers';
import Customers from './pages/Customers';
import MaterialTypes from './pages/MaterialTypes';
import RawMaterial from './pages/RawMaterial';
import JobWork from './pages/JobWork';
import Polishing from './pages/Polishing';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

const Navigation = () => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/raw-material', label: 'Raw Material', icon: '📦' },
    { to: '/job-work', label: 'Job Work', icon: '🔨' },
    { to: '/polishing', label: 'Polishing', icon: '✨' },
    { to: '/sales', label: 'Sales', icon: '💰' },
    { to: '/vendors', label: 'Vendors', icon: '🏪' },
    { to: '/job-workers', label: 'Job Workers', icon: '👷' },
    { to: '/polishers', label: 'Polishers', icon: '🧵' },
    { to: '/customers', label: 'Customers', icon: '👤' },
    { to: '/material-types', label: 'Material Types', icon: '📋' },
    { to: '/reports', label: 'Reports', icon: '📑' },
    { to: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h2>📦 StockTrack</h2>
      </div>
      <div className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/job-workers" element={<JobWorkers />} />
            <Route path="/polishers" element={<Polishers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/material-types" element={<MaterialTypes />} />
            <Route path="/raw-material" element={<RawMaterial />} />
            <Route path="/job-work" element={<JobWork />} />
            <Route path="/polishing" element={<Polishing />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;