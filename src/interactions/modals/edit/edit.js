module.exports = {
  name: "edit",
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeModal(interaction, client) {
    await interaction.reply({
      content: "Alright! Editing message.",
      ephemeral: true,
    });
    interaction.channel.messages
      .fetch(interaction.customId.split("-")[1])
      .then(async (message) => {
        await message.edit(interaction.fields.getTextInputValue("message"));
      });
  },
};
