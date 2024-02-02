module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    let button = client.buttons.get(interaction.customId);
    if (!button)
      button = client.buttons.get(
        interaction.customId.toString().split("-")[0]
      );

    if (!button) {
      client.error(
        `Button with custom id ${interaction.customId} does not exist.`
      );
      return interaction.reply({
        content: "This button does not exist.",
        ephemeral: true,
      });
    }

    try {
      await button.executeButton(interaction, client);
    } catch (error) {
      client.error("`Button issue` : " + error.stack);
      interaction.reply({
        content: "There was an error while executing this button.",
        ephemeral: true,
      });
    }
  },
};
