module.exports = {
  name: "send",
  /**
   * @param {import("discord.js").ModalSubmitInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeModal(interaction, client) {
    await interaction.reply({
      content: "Alright! Sending message...",
      ephemeral: true,
    });
    interaction.channel.send({
      content: interaction.fields.getTextInputValue("message"),
    });
  },
};
