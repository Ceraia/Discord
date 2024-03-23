const {
  EmbedBuilder,
  ActionRowBuilder,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  ephemeral: false,
  name: "manage",
  /**
   * @param {import("discord.js").ButtonInteraction} interaction
   * @param {import("discord.js").Client} client
   */
  async executeButton(interaction, client) {
    interaction
      .reply({ content: "Setting up panel.", ephemeral: true })
      .then((msg) => {
        interaction.message.delete();
        msg.edit({
          content: "Manage Commands.",
          components: [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("manage")
                .setMinValues(1)
            ),
          ],
        });
      });
  },
};
