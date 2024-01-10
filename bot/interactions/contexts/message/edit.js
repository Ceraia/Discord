const {
  ContextMenuCommandBuilder,
  PermissionsBitField,
  ApplicationCommandType,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  menu: new ContextMenuCommandBuilder()
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setName("Edit")
    .setType(ApplicationCommandType.Message)
    .setDMPermission(false),
  /**
   * @param {import("discord.js").MessageContextMenuCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeMenu(interaction, client) {
    interaction.showModal(
      new ModalBuilder()
        .setTitle("Edit a message")
        .setCustomId(`edit-${interaction.targetMessage.id}`)
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("message")
              .setLabel("Message")
              .setPlaceholder("New message")
              .setRequired(true)
              .setValue(interaction.targetMessage.content)
              .setStyle(TextInputStyle.Paragraph)
          )
        )
    );
  },
};
