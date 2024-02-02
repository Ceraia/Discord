module.exports = {
  name: "messageCreate",
  once: false,
  /**
   * @param {import("discord.js").Message} message
   * @param {import("discord.js").Client} client
   */
  async execute(message, client) {
    if (message.guild.id !== "750209335841390642") return;
    if (message.author.bot) return;

    if (message.author.id !== "244173330431737866") return;

    message.reply(
      `heh ${client.db.guilds.get(message.guild.id).dynvcs.enabled}`
    );
  },
};
