module.exports = {
  name: "guildMemberAdd",
  once: false,
  /**
   * @param {import("discord.js").GuildMember} member
   * @param {import("@client").BotClient} client
   */
  async execute(member, client) {
    client.db.getGuild(member.guild.id).then(async (guild) => {
      if (!guild.autoroles.length) return;
      if (!member.guild) if (guild.autoroles.length == 0) return;
      guild.autoroles.forEach((role) => {
        const guildRole = member.guild.roles.cache.get(role);
        if (!guildRole) return;

        member.roles.add(guildRole);
      });
    });
  },
};
