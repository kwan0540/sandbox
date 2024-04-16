import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const StartMenu = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: '100vh',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #161616, #000000)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Catch Game</h1>
      <nav className="navigation">
        <ul className="nav-list" style={{ listStyle: 'none', padding: 0 }}>
          <li className="nav-item" style={{ marginBottom: '1rem' }}>
            <Link to="/game" className="nav-link" style={linkStyle}>
              Start Game
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/leaderboard" className="nav-link" style={linkStyle}>
              Leaderboard
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const linkStyle = {
  textDecoration: 'none',
  color: '#FFD700',
  fontSize: '2rem',
  transition: 'color 0.3s ease-in-out',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
};

export default StartMenu;