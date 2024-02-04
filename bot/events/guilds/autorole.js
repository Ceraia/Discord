module.exports = {
  name: "guildMemberAdd",
  once: false,
  /**
   * @param {import("discord.js").GuildMember} member
   * @param {import("discord.js").Client} client
   */
  async execute(member, client) {
    client.db.guilds.get(member.guild.id).joinRoles.forEach((role) => {
      member.roles.add(role, "Autorole on join.").catch();
    });
  },
};
