require("dotenv").config();

class database {
  /**
   * @param {import("@client").BotClient} client
   */
  constructor(client) {
    require("mongoose")
      .connect(
        process.env.MONGOURI.replace(
          "<BOT>",
          `discord-${client.application.id}`
        ),
        {}
      )
      .then(() => {
        require("../logger").log("Connected to MongoDB");
      })
      .catch((err) => {
        require("../logger").error(err.stack);
      });
    this.client = client;

    this.guilds = require("./models/guildSchema.js").guilds;
    this.getGuild = require("./models/guildSchema.js").getGuild;
    this.users = require("./models/userSchema.js").users;
    this.getUser = require("./models/userSchema.js").getUser;
  }
}

module.exports = database;
