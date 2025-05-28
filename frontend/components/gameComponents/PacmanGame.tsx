"use client";

import { useEffect, useRef } from "react";

const PacmanGame = () => {
  const hasInitialized = useRef(false);

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve();

      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = () => {
        console.log("Loaded");
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.body.appendChild(script);
    });

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loadGame = async () => {
      try {
        const el = document.getElementById("pacman");
        if (el) el.innerHTML = ""; // Clear on fresh mount

        await loadScript("/games/pacman/modernizr-1.5.min.js");
        await loadScript("/games/pacman/pacman.js");

        const elAfter = document.getElementById("pacman");

        if (
          elAfter &&
          //@ts-ignore
          window.Modernizr?.canvas &&
          //@ts-ignore
          window.Modernizr?.localstorage &&
          //@ts-ignore
          window.Modernizr?.audio &&
          //@ts-ignore
          (window.Modernizr?.audio?.ogg || window.Modernizr?.audio?.mp3)
        ) {
          window.setTimeout(() => {
            // @ts-ignore
            window.PACMAN?.init(elAfter, "/games/pacman/");
          }, 0);
        } else {
          elAfter!.innerHTML = `
            Sorry, needs a decent browser<br />
            <small>(Firefox 3.6+, Chrome 4+, Opera 10+, Safari 4+)</small>
          `;
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadGame();

    return () => {
      const el = document.getElementById("pacman");
      if (el) el.innerHTML = ""; // Clean canvas
      const script = document.querySelector(
        'script[src="/games/pacman/pacman.js"]'
      );
      if (script) document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center items-center h-full rounded-lg overflow-hidden">
      <div
        id="pacman"
        className="bg-transparent mx-auto px-auto py-auto  min-h-[450px] min-w-[342px] "
      ></div>
    </div>
  );
};

export default PacmanGame;
