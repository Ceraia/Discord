const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

let client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Get settings js file
const settings = require("../settings.js");
const { log, error, debug, warning } = require("./logger.js");
const { initializeClient } = require("./initializers.js");

// Import settings into the client
client.settings = settings;

// Client maps
client.textcommands = new Map();
client.slashcommands = new Map();
client.aliases = new Map();
client.buttons = new Map();
client.modals = new Map();

// Client database
client.database = new Map();

// Client cache
client.cache = new Map();

// Client logging
client.log = log;
client.error = error;
client.debug = debug;
client.warning = warning;
client.logqueue = [];

// Client initialization
client.once("ready", async () => {
  // Call the initialization function
  await initializeClient(client);
});

// Make sure no matter what error occurs, the bot doesn't crash
process.on("uncaughtException", (error) => {
  client.error(error.stack);
});

module.exports = {
  client,
};
