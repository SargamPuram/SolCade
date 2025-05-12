// pages/games/snake.js

import { useEffect } from "react";

export default function SnakeGame() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/games/Snake-Game/script.js"; // Make sure this path is correct
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/games/Snake-Game/style.css" />
      <div className="snake-container">
        <h1>Snake Game</h1>
        <div className="app-container">
          <div className="scores">
            <p>
              Score:<span id="score">0</span>
            </p>
            <p id="high-score">1000</p>
          </div>
          <div className="board"></div>
        </div>
        <div className="btns">
          <button className="reset btn">Restart</button>
        </div>
      </div>
    </>
  );
}
