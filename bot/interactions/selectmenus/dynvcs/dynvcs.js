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
    const vc = interaction.member.voice.channel;

    if (!vc)
      return interaction.update({
        content: "You need to be in a voice channel to use this button!",
        components: [],
      });

    if (
      !vc.permissionOverwrites.resolve(client.user.id) ||
      !vc.permissionOverwrites
        .resolve(client.user.id)
        .allow.has(PermissionsBitField.Flags.AddReactions)
    )
      return interaction.update({
        content: "This is not a dynamic vc!",
        components: [],
      });

    if (
      !vc.permissionOverwrites.resolve(interaction.member.id) ||
      !vc.permissionOverwrites
        .resolve(interaction.member.id)
        .allow.has(PermissionsBitField.Flags.AddReactions)
    )
      return interaction.update({
        content: "This is not your dynamic vc!",
        components: [],
      });

    if (action == "invite") {
      // Add permission overrides for the user(s) to always see and be able to join the channel

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
