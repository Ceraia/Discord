// @ts-check
const { loadInteractions } = require("./interactions.js");
const { loadScheduler } = require("./scheduler.js");

module.exports.initializeClient = async (client) => {
  client.log(`Loading client. ${client.user.tag}`);

  // Load all interactions
  await loadInteractions(client);

  // Load the scheduler
  await loadScheduler(client);
};
