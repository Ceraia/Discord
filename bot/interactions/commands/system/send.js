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
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("Send a message as the bot"),
  category: "system",
  textcommand: false,
  /**
   * @param {import("discord.js").Interaction} interaction
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
