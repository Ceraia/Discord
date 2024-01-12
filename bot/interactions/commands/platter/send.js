const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "send",
  aliases: [],
  slashcommand: new SlashCommandBuilder()
    .setName("send")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .setDescription("Send a message as the bot."),
  guild: "750209335841390642",
  /**
   * @param {import("discord.js").CommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    interaction.showModal(
      new ModalBuilder()
        .setTitle("Send a message")
        .setCustomId(`send`)
        .setComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setStyle(TextInputStyle.Paragraph)
              .setLabel("Message")
              .setPlaceholder("Message")
              .setCustomId("message")
              .setRequired(true)
          )
        )
    );
  },
};
