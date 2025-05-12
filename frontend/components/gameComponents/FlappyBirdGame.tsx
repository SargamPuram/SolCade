// pages/games/flappy.js

import { useEffect } from "react";

export default function FlappyBirdGame() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/games/JS-Flappy-Bird/game.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <link rel="stylesheet" href="/games/JS-Flappy-Bird/style.css" />

      <canvas
        id="canvas"
        width="276"
        height="414"
        className="bg-[#30c0df] border border-black mx-auto px-auto py-auto "
      ></canvas>
    </>
  );
}
