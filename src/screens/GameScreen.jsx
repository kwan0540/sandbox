import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GameScreen.css";
import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";
import e1 from "../assets/e1.png";
import e2 from "../assets/e2.png";
import axios from "axios";
import socketIOClient from 'socket.io-client'

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [catcherPosition, setCatcherPosition] = useState(0);
  const [items, setItems] = useState([]);
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null)
  const pArray = [p1, p2, p3, p4, e1, e2];
  let backendUrl = 'http://localhost:3001'

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    if (time === 0) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [time, score]);

  useEffect(() => {
    const socketResult = socketIOClient(backendUrl)
    setSocket(socketResult)
      // Clean up the socket connection on component unmount
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        handleCatcherMove(-1);
      } else if (event.key === "ArrowRight") {
        handleCatcherMove(1);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      socketResult.disconnect();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const itemInterval = setInterval(() => {
      const randomPosition = Math.floor(Math.random() * window.innerWidth + 5);
      const randomPic = Math.floor(Math.random() * 6);
      const pic = pArray[randomPic];
      let score = 50;
      let speed = 20;
      if (randomPic >= 4) {
        speed = 50;
      }
      if (randomPic >= 4) {
        score = 100;
      }
      const newItem = {
        id: Date.now(),
        position: randomPosition / 20,
        picture: pic,
        y: 0,
        score,
        speed,
      };
      setItems((prevItems) => [...prevItems, newItem]);
    }, 2000);

    return () => clearInterval(itemInterval);
  }, []);

  useEffect(() => {
    const updateItemPositions = () => {
      setItems((prevItems) => {
        return prevItems.map((item) => ({
          ...item,
          y: item.y + item.speed, // Adjust the falling speed as needed
        }));
      });
    };

    const positionInterval = setInterval(updateItemPositions, 200); // Adjust the falling speed as needed

    return () => clearInterval(positionInterval);
  }, []);

  useEffect(() => {
    const checkCollision = () => {
      const catcherLeft = catcherPosition * 20 - 50;
      const catcherRight = catcherLeft + 150; // Adjust the width as per your catcher image
      const catcherTop = 510; // Adjust the top position based on your game container size
      const catcherBottom = catcherTop + 300; // Adjust the height as per your catcher image

      items.forEach((item) => {
        const itemLeft = item.position * 20;
        const itemRight = itemLeft + 50; // Adjust the width as per your item image
        const itemTop = item.y;
        const itemBottom = itemTop + 50; // Adjust the height as per your item image

        if (
          catcherRight >= itemLeft &&
          catcherLeft <= itemRight &&
          catcherBottom >= itemTop &&
          catcherTop <= itemBottom
        ) {
          handleItemCatch(item.id, item.score);
        }
      });
    };

    const collisionInterval = setInterval(checkCollision, 100); // Adjust the interval time as needed

    return () => clearInterval(collisionInterval);
  }, [catcherPosition, items]);

  const handleCatcherMove = (direction) => {
    setCatcherPosition((prevCatcherPos) => {
      const newPosition = prevCatcherPos + direction;
      console.log(newPosition);
      console.log(document.body.scrollWidth);
      console.log(window.screen.availWidth);
      if (newPosition >= 0 && newPosition * 20 <= window.innerWidth - 170) {
        return newPosition;
      } else {
        return prevCatcherPos;
      }
    });
  };

  const handleItemCatch = (itemId, itemScore) => {
    setScore((prevScore) => prevScore + itemScore);
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  if (time == 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1 style={{ color: "black", fontWeight: "bold", fontSize: "60px" }}>
          Game Over!
        </h1>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
            width: "300px",
            maxWidth: "100%",
          }}
        />
          <button
          disabled={username === ""}
          className="game-button"
          onClick={async () => {
            await axios.post("http://localhost:3001/player", {
              name: username, // Include the username in the request payload
              score: score,
              // Add any additional data you want to send
            });
            if (socket) {
              console.log(socket)
               socket.emit('player', {})
            }
            window.location.reload();
          }}
        >
          Play Again
        </button>
        <button
          disabled={username === ""}
          className="game-button"
          onClick={async () => {
            await axios.post("http://localhost:3001/player", {
              name: username, // Include the username in the request payload
              score: score,
              // Add any additional data you want to send
            });
            if (socket) {
              console.log(socket)
               socket.emit('player', {})
            }
            window.location.href = '/leaderboard'
          }}
        >
          LEADERBOARD
        </button>
        
      </div>
    );
  }

  return (
    <div>
      <p className="score">Score: {score}</p>
      <p className="time">Time: {time}</p>
      <div className="game-container">
        <div className="ground"></div>
        <div
          className="catcher"
          style={{
            left: `${catcherPosition * 20}px`,
          }}
        ></div>
        {items.map((item) => (
          <div
            key={item.id}
            className="item"
            style={{
              top: `${item.y}px`,
              left: `${item.position * 20}px`,
              backgroundImage: `url(${item.picture})`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
