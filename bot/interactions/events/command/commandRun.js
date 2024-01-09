module.exports = {
  name: "interactionCreate",
  once: false,
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.slashcommands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.defer || command.defer == null) {
        if (command.ephemeral)
          await interaction.deferReply({ ephemeral: true });
        else await interaction.deferReply();
      }
      await command.executeSlash(interaction, client);
    } catch (error) {
      client.error("`Command issue` : " + error.stack);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: command.ephemeral,
      });
    }
  },
};
