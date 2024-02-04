module.exports = {
  name: "guildMemberRemove",
  once: false,
  /**
   * @param {import("discord.js").GuildMember} member
   * @param {import("discord.js").Client} client
   */
  async execute(member, client) {
    client.db.guilds.get(member.guild.id).stickyRoles.users[member.id] =
      member.roles.cache.map((role) => role.id);

    client.db.guilds.saveData();
  },
};
