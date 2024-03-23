const {
  ActionRowBuilder,
  MentionableSelectMenuBuilder,
  EmbedBuilder,
  RoleSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  name: "reactionrole",
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeModal(interaction, client) {
    if (interaction.customId.split("-")[1] == "message") {
      const message = interaction.fields.getTextInputValue("message");

      interaction.reply({
        content: `${message}`,
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setDescription("Select the roles you want to add.")
            .setColor(0x2b2d31),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
              .setCustomId("reactionrole-roles")
              .setPlaceholder("Select roles.")
              .setMinValues(1)
              .setMaxValues(25)
          ),
        ],
      });
    }
  },
};
