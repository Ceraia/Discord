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
    )
    .addSubcommand((subcommand) =>
      subcommand
        .addAttachmentOption((option) =>
          option
            .setName("image")
            .setDescription("The image to send.")
            .setRequired(true)
        )
        .setDescription("Send an image as the bot.")
        .setName("image")
    ),
  guild: "750209335841390642",
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeSlash(interaction, client) {
    if (interaction.options.getSubcommand() === "text") {
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
    } else if (interaction.options.getSubcommand() === "image") {
      interaction.deferReply({ ephemeral: true });
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
    }
  },
};
