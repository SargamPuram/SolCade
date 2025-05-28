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
        if (el) el.innerHTML = "";
        console.log("Cleared old content");

        await loadScript("/games/Pacman/modernizr-1.5.min.js");
        console.log("Loaded modernizr");

        await loadScript("/games/Pacman/pacman.js");
        //@ts-ignore
        console.log("Loaded pacman.js", window.PACMAN);

        const elAfter = document.getElementById("pacman");

        const supported =
          //@ts-ignore
          window.Modernizr?.canvas &&
          //@ts-ignore
          window.Modernizr?.localstorage &&
          //@ts-ignore
          window.Modernizr?.audio &&
          //@ts-ignore

          (window.Modernizr?.audio?.ogg || window.Modernizr?.audio?.mp3);

        console.log("Modernizr supported:", supported);

        if (elAfter && supported) {
          console.log("Calling PACMAN.init...");
          //@ts-ignore
          window.PACMAN?.init(elAfter, "/games/Pacman/");

        } else {
          elAfter!.innerHTML = `Sorry, needs a decent browser`;
        }
      } catch (error) {
        console.error("Pacman Load Error", error);
      }
    };

    loadGame();

    return () => {
      const el = document.getElementById("pacman");
      if (el) el.innerHTML = "";
      const script = document.querySelector(
        'script[src="/games/Pacman/pacman.js"]'
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
