module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;
    let modal = await client.modals.get(interaction.customId);
    if (!modal)
      modal = await client.modals.get(interaction.customId.split("-")[0]);

    if (!modal) {
      client.error(interaction.customId);
      client.error(interaction.customId.split("-")[0]);

      return client.error("Modal not found!");
    }
    try {
      await modal.executeModal(interaction, client);
    } catch (error) {
      client.error("`Modal issue` : " + error.stack);
      await interaction.reply({
        content: "There was an error while executing this modal!",
        ephemeral: true,
      });
    }
  },
};
