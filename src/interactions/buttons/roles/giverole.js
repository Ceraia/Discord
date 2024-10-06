module.exports = {
  ephemeral: true,
  name: "giverole",
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeButton(interaction, client) {
    interaction.member.roles
      .add(interaction.customId.split("-")[1])
      .then(() => {
        interaction.reply({
          content: `You have been given the <@&${
            interaction.customId.split("-")[1]
          }> role.`,
          ephemeral: this.ephemeral,
        });
      })
      .catch(() => {
        interaction.reply({
          content: "I do not have the permissions to give you this role.",
          ephemeral: this.ephemeral,
        });
      });
  },
};
