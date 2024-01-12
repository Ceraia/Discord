const { activePurchases } = require("../../commands/platter/stripe");

module.exports = {
  ephemeral: false,
  name: "cancel",
  /**
   * @param {import("discord.js").AnySelectMenuInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeButton(interaction, client) {
    activePurchases.delete(interaction.message.id);
    interaction.update({ content: "Cancelled.", components: [], embeds: [] });
  },
};
