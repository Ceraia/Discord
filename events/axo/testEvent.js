module.exports = {
  name: "messageCreate",
  once: false,
  /**
   * @param {import("discord.js").Message} message
   * @param {import("discord.js").Client} client
   */
  async execute(message, client) {
    if (message.guild.id == "750209335841390642") {
      if (!message.member) return;
      client.db.guilds.findOne({ guildId: message.guild.id }).then((guild) => {
        if (!guild) {
          const newGuild = new client.db.guilds({
            guildId: message.guild.id,
          });
          newGuild.save();

          client.log(`Created new guild document for ${message.guild.id}`);
        }
      })
    }
  },
};
