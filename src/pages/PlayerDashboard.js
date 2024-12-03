import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import '../styles/Dashboard.css';

const PlayerDashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Player Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/player-dashboard/quizzes">View Quizzes</Link></li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <Outlet /> {/* Render nested routes */}
      </div>
    </div>
  );
};

export default PlayerDashboard;
