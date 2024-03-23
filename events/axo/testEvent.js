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
      client.db.get(message.guild.id).then((guild) => {
        if(!guild) client.db.set(message.guild.id, { id: message.guild.id, data: { prefix: "!" } });
        client.log(guild);
      });
    }
  },
};
