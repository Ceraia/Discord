module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async execute(interaction, client) {
    if (!interaction.isContextMenuCommand()) return;

    const command = client.contexts.get(interaction.commandName);
    if (!command) return client.error("Context not found!");

    try {
      await command.executeMenu(interaction, client);
    } catch (error) {
      client.error("`Command issue` : " + error.stack);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: command.ephemeral,
      });
    }
  },
};
