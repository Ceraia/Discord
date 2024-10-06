// @ts-check
module.exports = {
  /**
   * @param {import("discord.js").ChatInputCommandInteraction} interaction
   * @param {String} content
   */
  safeReply: function safeReply(interaction, content) {
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply(content);
    }
    return interaction.reply(content);
  },
};
