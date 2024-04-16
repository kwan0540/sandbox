import React, { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client'
import axios from "axios";
import { Link } from "react-router-dom";
import './Leaderboard.css'

const Leaderboard = () => {
  const backendUrl = 'http://localhost:3001'
  const [leaderboardData, setLeaderboardData] = useState([]);
    useEffect(()=>{
      const getUser = async () => {
        const users = await axios.get(`${backendUrl}/player`)
        console.log(users)
        const formatedUser = users.data.map(user => {
          return {
            playerName: user.name,
            score: user.score
          }
        })
        formatedUser.sort((a, b) => b.score - a.score);
        console.log(formatedUser)
        setLeaderboardData(formatedUser)
      }
      getUser()
      const socket = socketIOClient(backendUrl)
      socket.on('player', (message) => {
        console.log(message)
        const formatedMessage = message.user.map(player => {
          return {
            playerName: player.name,
            score: player.score
          }
        })
        formatedMessage.sort((a, b) => b.score - a.score);
        setLeaderboardData(formatedMessage)
      });
      // Clean up the socket connection on component unmount
      return () => {
        socket.disconnect();
      };
    },[])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #161616, #000000)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "2rem" }}>Leader board</h1>
      <div className="table-container">
        <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Rank</th>
            <th style={tableHeaderStyle}>Player</th>
            <th style={tableHeaderStyle}>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>{index + 1}</td>
              <td style={tableCellStyle}>{entry.playerName}</td>
              <td style={tableCellStyle}>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      <Link to="/game">
        <button className="custom-button">Back to game</button>
      </Link>
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: "#FFD700",
  color: "#000000",
  padding: "0.5rem 1rem",
};

const tableCellStyle = {
  backgroundColor: "#000000",
  color: "#FFFFFF",
  padding: "0.5rem 1rem",
};

export default Leaderboard;