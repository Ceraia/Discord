const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  name: "dynvc",
  /**
   * @param {import("discord.js").UserSelectMenuInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeMenu(interaction, client) {
    const subcommand = interaction.customId;
    const action = subcommand.split("-")[1];

    if (action == "invite") {
      // Add permission overrides for the user(s) to always see and be able to join the channel
      const vc = interaction.member.voice.channel;
      interaction.values.forEach(async (member) => {
        await vc.permissionOverwrites.create(member, {
          ViewChannel: true,
          Connect: true,
        });
      });

      return await interaction.update({
        content: "Added permission overrides for the user(s)!",
        components: [],
      });
    }

    if (action == "ban") {
      // Remove permission overrides for the user(s) to always see and be able to join the channel
      const vc = interaction.member.voice.channel;
      interaction.values.forEach(async (member) => {
        // Check if the member has an override role
        const memberRoles = interaction.guild.members.cache
          .get(member)
          .roles.cache.map((role) => role.id);
        const overrideRoles = client.db.guilds
          .get(interaction.guild.id)
          .dynvcs.overrides.filter((role) => memberRoles.includes(role));
        if (overrideRoles.length > 0) {
          return;
        } else {
          await vc.permissionOverwrites
            .create(member, {
              ViewChannel: false,
              Connect: false,
            })
            .catch();
          if (vc.members.get(member))
            vc.members.get(member).voice.setChannel(null);
        }
      });

      return await interaction.update({
        content: "Removed permission overrides for the user(s)!",
        components: [],
      });
    }
  },
};
