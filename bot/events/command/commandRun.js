module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.slashcommands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.executeSlash(interaction, client);
    } catch (error) {
      client.error("`Command issue` : " + error.stack);
      await interaction
        .reply({
          content: "There was an error while executing this command!",
          ephemeral: command.ephemeral,
        })
        .catch(async () => {
          await interaction.editReply({
            content: "There was an error while executing this command!",
            ephemeral: command.ephemeral,
          });
        });
    }
  },
};
