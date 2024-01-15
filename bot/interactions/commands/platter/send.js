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
    .setDescription("Send messages as the bot.")
    .addSubcommand((subcommand) =>
      subcommand.setName("text").setDescription("Send a text message.")
    ),
  guild: "750209335841390642",
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
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
