module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashcommands.get(interaction.commandName);
    if (!command) {
      // Delete the command
      await interaction.reply({
        content:
          "This command could not be found, we will be fixing that ASAP.",
        ephemeral: true,
      });

      await interaction.command.delete();

      return client.error(`Command not found, ${interaction.commandName}`);
    }

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
