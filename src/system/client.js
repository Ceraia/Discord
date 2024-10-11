// @ts-check
const { Client, GatewayIntentBits, Partials, ActivityType, ChannelType } = require("discord.js");
const { log, error, debug, warning } = require("./logger.js");
const { initializeClient } = require("./initializers.js");
const database = require("./database/index.js");
const http = require("http");

class BotClient extends Client {
  constructor(options) {
    super(options);

    // Load settings
    this.settings = require("../settings.js");

    // Initialize Maps
    this.textcommands = new Map();
    this.slashcommands = new Map();
    this.contexts = new Map();
    this.aliases = new Map();
    this.buttons = new Map();
    this.modals = new Map();
    this.selectmenus = new Map();

    // Load logger functions
    this.log = log;
    this.error = error;
    this.debug = debug;
    this.warning = warning;

    // Load client utilities
    this.safeReply = require("./utilities").safeReply;

    // Initialize database
    this.db = null; // Database will be initialized in the `initializeDatabase` method

    // Client initialization
    this.once("ready", async () => {
      // Initialize the database
      this.db = new database(this);

      // Log the client's tag
      this.log(`Logged in as ${client.user.tag}`);
      
      // Set the bot's activity every 10 minutes
      client.user.setActivity("with the API", { type: ActivityType.Playing });
      setInterval(() => {
        client.user.setActivity("with the API", { type: ActivityType.Playing });
      }, 600000);

      // Notify the bots status in the status channel if it's set
      if (process.env.STATUS_CHANNEL) { 
        const statusChannel = client.channels.cache.get(process.env.STATUS_CHANNEL);
        if (statusChannel && statusChannel.type === ChannelType.GuildText) {
          statusChannel.send(`Bot has been booted up. Logged in as ${client.user.tag}`);
        }
      }

      // Create a server for health checks
      http.createServer((req, res) => {
        if (req.url === '/health') {
          // Check if the bot is connected and ready
          if (client.isReady()) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Bot is healthy');
          } else {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Bot is unhealthy');
          }
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
        }
      }).listen(8080, () => {
        this.log("Health check server is running on port 8080");
      });

      // Call the initialization function
      await initializeClient(this);
    });

    // Make sure no matter what error occurs, the bot doesn't crash
    process.on("uncaughtException", (error) => {
      this.error(error.stack?.toString() ?? error.toString());
    });
  }
}

const client = new BotClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.GuildMember,
    Partials.User,
    Partials.Message,
    Partials.Channel,
  ],
});

module.exports = {
  client,
  BotClient
};
