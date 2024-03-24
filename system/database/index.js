require("dotenv").config();

class database {
  /**
   * @param {import("discord.js").Client} client
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
    this.guilds = require("./models/guildSchema.js");
  }
}

module.exports = database;
