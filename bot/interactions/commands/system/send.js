const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  ActionRowBuilder,
} = require("discord.js");
const path = require("path");
const currentDirectory = path.dirname(__filename);
const parentDirectoryName = path.basename(path.dirname(currentDirectory));

module.exports = {
  name: "send",
  aliases: [],
  slashcommand: new SlashCommandBuilder()
    .setName("send")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDescription("Send a message as the bot"),
  category: parentDirectoryName,
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
