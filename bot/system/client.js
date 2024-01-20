const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const Stripe = require("stripe");

// Get settings js file
const settings = require("../settings.js");
const { log, error, debug, warning } = require("./logger.js");
const { initializeClient } = require("./initializers.js");
const Database = require("./database");

// Import settings into the client
client.settings = settings;

// Client maps
client.textcommands = new Map();
client.slashcommands = new Map();
client.contexts = new Map();
client.aliases = new Map();
client.buttons = new Map();
client.modals = new Map();
client.selectmenus = new Map();

// Client logging
client.log = log;
client.error = error;
client.debug = debug;
client.warning = warning;
client.logqueue = [];

// Payment gateway
client.stripe = Stripe(client.settings.stripe.secret);
client.products = new Map();

// Client database
client.db = {
  database: new Database("database"),
  guilds: new Database("guilds"),
  users: new Database("users"),
};

// BigInt
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};

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
