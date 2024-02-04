const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "manage",
  category: "admin",
  slashcommand: new SlashCommandBuilder()
    .setName("manage")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .setDescription("Different commands to help manage a server.")
    .addSubcommandGroup((group) =>
      group
        .setName("logs")
        .setDescription("Commands to handle logs.")
        .addSubcommand((sub) =>
          sub
            .setName("set")
            .setDescription("Set a channel for logs.").addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("The channel to set for logs. (Leave empty to disable.)")
                .setRequired(false)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    let subcommandGroup = interaction.options.getSubcommandGroup();
    let subcommand = interaction.options.getSubcommand();
    if (subcommandGroup === "logs") {
      if (subcommand === "set") {
        let channel = interaction.options.getChannel("channel");
        if (channel) {
          client.db.guilds.get(interaction.guild.id).logs = channel.id;
          client.db.guilds.saveData();
          await interaction.editReply({
            content: `Logs channel has been set to ${channel}.`,
          });
        } else {
          client.db.guilds.get(interaction.guild.id).logs = null;
          client.db.guilds.saveData();
          await interaction.editReply({
            content: `Logs channel has been disabled.`,
          });
        }
      }
    }
  },
};
