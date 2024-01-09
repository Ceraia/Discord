const { updateWallboard } = require("../functions/stockMarket");
const { saveDatabaseMap } = require("./database");

async function loadScheduler(client) {
  client.log("Loaded scheduler.");
  initializeWallboard(client);
  autoDatabaseSave(client);
}

async function initializeWallboard(client) {
  // Run the update wallboard function every 1 minute
  updateWallboard(client);
  setInterval(() => {
    updateWallboard(client);
  }, 0.5 * 60 * 1000);
}

async function autoDatabaseSave(client) {
  // Save the database every 30 seconds
  setInterval(() => {
    saveDatabaseMap(client);
  }, 0.5 * 60 * 1000);
}

module.exports = {
  loadScheduler,
};
