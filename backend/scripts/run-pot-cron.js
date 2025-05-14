// scripts/run-pot-cron.js
require("dotenv").config();
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const { GamePot } = require("../models/GamePot");
const { getTop5PublicKeys } = require("../utils/some-utils");

const GAME_Object_ID = "68210f89681811dd521231f4";
const gameId = "flappy_bird";

async function runCron() {
  console.log(`Cron triggered at ${new Date().toISOString()}`);
  let potNumber;

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const response = await fetch(`${process.env.SERVER_URL}/pot/latest/${gameId}`);
    const data = await response.json();
    const latestPot = data.pot;
    potNumber = latestPot.potNumber;

    const potId = await GamePot.findOne({ gameId: GAME_Object_ID, potNumber });

    const response2 = await fetch(
      `${process.env.SERVER_URL}/leaderboard/${GAME_Object_ID}/${potId._id}/`
    );
    const data2 = await response2.json();
    const result = getTop5PublicKeys(data2);

    const response3 = await fetch(`${process.env.SERVER_URL}/pot/distribute-winners`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: GAME_Object_ID,
        potPublicKey: potId.potPublicKey,
        winners: result,
      }),
    });
    const data3 = await response3.json();
    console.log(data3);

    if (latestPot.status !== "Ended") {
      const closeRes = await fetch(`${process.env.SERVER_URL}/pot/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: GAME_Object_ID, potNumber }),
      });

      const closeData = await closeRes.json();
      console.log(`Closed pot ${potNumber}:`, closeData.message);
    }

    const nextPotNumber = potNumber + 1;
    const initRes = await fetch(`${process.env.SERVER_URL}/pot/initialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: GAME_Object_ID, potNumber: nextPotNumber }),
    });
    const initData = await initRes.json();
    console.log(`Initialized pot ${nextPotNumber}:`, initData.message);

    process.exit(0);
  } catch (err) {
    console.error("Cron job error:", err.message);
    process.exit(1);
  }
}

runCron();
