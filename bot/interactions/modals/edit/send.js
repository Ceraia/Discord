module.exports = {
  name: "edit",
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeModal(interaction, client) {
    await interaction.reply({
      content: "Alright! Attempting to edit message...",
      ephemeral: true,
    });
    interaction.channel.messages
      .fetch(interaction.customId.split("-")[1])
      .then(async (message) => {
        await message.edit(interaction.fields.getTextInputValue("message"));
      });
  },
};
