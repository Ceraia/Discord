const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  name: "image",
  slashcommand: new SlashCommandBuilder()
    .setName("image")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("The image to send.")
        .setRequired(true)
    )
    .setDescription("Send an image as the bot."),
  guild: "750209335841390642",
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    interaction.deferReply({ ephemeral: true });
    // Send the attachment in the interaction channel
    interaction.channel
      .send({
        files: [interaction.options.getAttachment("image")],
      })
      .then(() => {
        interaction.editReply({ content: "Image sent.", ephemeral: true });
      })
      .catch((e) => {
        interaction.editReply({
          content: "An error occured.",
          ephemeral: true,
        });
      });
  },
};
