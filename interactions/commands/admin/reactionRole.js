const {
  SlashCommandBuilder,
  PermissionsBitField,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  name: "reactionrole",
  category: "admin",
  slashcommand: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
    .setDMPermission(false)
    .setDescription("Reaction role commands.")
    .addSubcommandGroup((group) =>
      group
        .setName("create")
        .setDescription("Create a reaction role.")
        .addSubcommand((sub) =>
          sub
            .setName("message")
            .setDescription("Create a reaction role message.")
        )
    ),
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeSlash(interaction, client) {
    if (interaction.options.getSubcommandGroup() === "create") {
      if (interaction.options.getSubcommand() === "message") {
        interaction.showModal(
          new ModalBuilder()
            .setTitle("Message for Reaction Roles")
            .setCustomId("reactionrole-message")
            .setComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setRequired(true)
                  .setCustomId("message")
                  .setLabel("Message")
                  .setPlaceholder("Message for reaction role.")
                  .setValue("Get your roles here!")
                  .setStyle(TextInputStyle.Paragraph)
                  .setMaxLength(2000)
                  .setMinLength(1)
              )
            )
        );
      }
    }
  },
};
