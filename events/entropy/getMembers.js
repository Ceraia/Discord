module.exports = {
  name: "messageCreate",
  once: true,
  /**
   * @param {import("discord.js").GuildMember} oldMember
   * @param {import("discord.js").GuildMember} newMember
   * @param {import("discord.js").Client} client
   */
  async execute(message, client) {
    client.guilds.cache.get(client.settings.entropy.guild)?.members.fetch();
    client.log("Fetched all members in the entropy guild.");
  },
};
