module.exports = {
  name: "guildMemberAdd",
  once: false,
  /**
   * @param {import("discord.js").GuildMember} member
   * @param {import("discord.js").Client} client
   */
  async execute(member, client) {
    if (client.db.guilds.get(member.guild.id).stickyRoles.enabled) {
      client.db.guilds.get(member.guild.id).joinRoles.forEach((role) => {
        // Check if the role is in the blacklist
        if (
          client.db.guilds
            .get(member.guild.id)
            .stickyRoles.blacklist.includes(role)
        )
          return;
        member.roles.add(role, "Sticky role on join.").catch();
      });
      // Delete the user from the stickyRoles object
      delete client.db.guilds.get(member.guild.id).stickyRoles.users[member.id];
      client.db.guilds.saveData();
    }
  },
};
