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
    if (!command) return client.error("Command not found.");

    try {
      await command.executeSlash(interaction, client);
    } catch (error) {
      client.error("`Command issue` : " + error.stack);
      await interaction
        .reply({
          content: "There was an error while executing this command!",
        })
        .catch(async () => {
          await interaction
            .editReply({
              content: "There was an error while executing this command!",
            })
            .catch(async () => {
              await interaction.followUp({
                content: "There was an error while executing this command!",
              });
            });
        });
    }
  },
};
