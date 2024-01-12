const {
  EmbedBuilder,
  ActionRowBuilder,
  UserSelectMenuBuilder,
} = require("discord.js");
const { activePurchases } = require("../../commands/platter/stripe");

module.exports = {
  ephemeral: false,
  name: "purchase",
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeButton(interaction, client) {
    let purchase = activePurchases.get(interaction.message.id);

    if (!purchase)
      return interaction.message.deletable
        ? interaction.message.delete()
        : interaction.message.edit({
            content: "This message has expired.",
            components: [],
            embeds: [],
          });

    interaction.update({
      embeds: [],
      components: [
        new ActionRowBuilder().addComponents(
          new UserSelectMenuBuilder()
            .setCustomId("purchase")
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder("Who is this purchase for?")
        ),
      ],
    });
  },
};
