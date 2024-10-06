// @ts-check
const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { panelmessage } = require("../admin/dynamicVcs");

module.exports = {
  name: "vc",
  category: "vcs",
  slashcommand: new SlashCommandBuilder()
    .setName("vc")
    .setDescription("VC Related Commands.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Connect)
    .addSubcommand((subcommand) =>
      subcommand.setName("manage").setDescription("Manage a/your VC.")
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    // @ts-ignore
    interaction.editReply(panelmessage);
  },
};
