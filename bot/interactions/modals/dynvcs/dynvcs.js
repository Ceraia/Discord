module.exports = {
  name: "dynvc",
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeModal(interaction, client) {
    const action = interaction.customId.split("-")[1];
    await interaction.deferReply({ ephemeral: true });

    if (action == "rename") {
      let target = interaction.customId.split("-")[2];
      let channel = interaction.guild.channels.cache.get(target);

      if (!channel)
        return interaction.editReply({
          content: "The channel does not exist anymore!",
          ephemeral: true,
        });

      // Rename the channel
      channel
        .setName(
          client.db.guilds.get(interaction.guild.id).dynvcs.prefix +
            interaction.fields.getTextInputValue("dynvc-rename")
        )
        .then((c) => {
          interaction.editReply({
            content: `Renamed the channel to ${c.name}.`,
            ephemeral: true,
          });
        })
        .catch((e) => {
          interaction.editReply({
            content: `Failed to rename your channel, this could be because the name is inappropriate or a permission error.`,
            ephemeral: true,
          });
        });
    }
  },
};
