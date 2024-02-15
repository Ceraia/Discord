const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  name: "banlogger",
  category: "bgn",
  guild: "324195889977622530",
  slashcommand: new SlashCommandBuilder()
    .setName("banlogger")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .setDescription("Ban-logger utilities.")
    .addIntegerOption((option) =>
      option
        .setName("64id")
        .setDescription("The 64ID of the target.")
        .setRequired(true)
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    interaction.deferReply({ ephemeral: true });
  },
};
