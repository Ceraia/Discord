module.exports = {
  name: "interactionCreate",
  once: false,
  /**
   * @param {import("discord.js").AnySelectMenuInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async execute(interaction, client) {
    if (!interaction.isAnySelectMenu()) return;
    let selectmenu = await client.selectmenus.get(interaction.customId);
    if (!selectmenu)
      selectmenu = await client.selectmenus.get(
        interaction.customId.split("-")[0]
      );

    if (!selectmenu) {
      client.error(interaction.customId);
      client.error(interaction.customId.split("-")[0]);

      return client.error("selectmenu not found!");
    }
    try {
      await selectmenu.executeMenu(interaction, client);
    } catch (error) {
      client.error("`selectmenu issue` : " + error.stack);
      await interaction.reply({
        content: "There was an error while executing this selectmenu!",
        ephemeral: true,
      });
    }
  },
};
