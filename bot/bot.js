require("dotenv").config();
require("module-alias/register");
require("@src/helpers/extenders");

const path = require("path");
const { validateConfig } = require("@utils/botUtils");
const { initializeMongoose } = require("@src/database/mongoose");
const { BotClient } = require("@src/structures");
const { playerEvents } = require("@src/helpers/musicEvents");

global.__appRoot = path.resolve(__dirname);

// initialize client
const client = new BotClient();
client.loadCommands("src/commands");
client.loadContexts("src/contexts");
client.loadEvents("src/events");
client.snipes = new Map();

playerEvents(client);

// client.player = new Player(
//   client //, client.config.opt.discordPlayer
// );

// find unhandled promise rejections
process.on("unhandledRejection", (err) => client.logger.error(`Unhandled exception`, err));

(async () => {
  validateConfig();

  // initialize the database//4/2
  await initializeMongoose();

  // start the dashboard
  if (client.config.DASHBOARD.enabled) {
    client.logger.log("Launching dashboard");
    try {
      const { launch } = require("@root/dashboard/app");
      await launch(client);
    } catch (ex) {
      client.logger.error("Failed to launch dashboard", ex);
    }
  }

  // start the client
  await client.login(process.env.BOT_TOKEN);
})();
