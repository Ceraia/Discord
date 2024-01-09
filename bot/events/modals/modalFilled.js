module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;
    let modal = client.modals.get(interaction.customId);
    if (!modal) modal = client.modals.get(interaction.customId.split("-")[0]);

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
