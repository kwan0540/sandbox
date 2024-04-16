import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StartMenu from "./screens/StartMenu";
import GameScreen from "./screens/GameScreen";
import Leaderboard from "./screens/Leaderboard";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<StartMenu />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
};

export default App;
