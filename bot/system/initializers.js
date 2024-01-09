const { loadDatabaseMap } = require("./database.js");
const { loadInteractions } = require("./interactions.js");
const { loadScheduler } = require("./scheduler.js");

module.exports.initializeClient = async (client) => {
  client.log("Initializing client.");

  // Load all interactions
  await loadInteractions(client);

  // Load the database
  await loadDatabaseMap(client);

  // Load the scheduler
  await loadScheduler(client);
};
