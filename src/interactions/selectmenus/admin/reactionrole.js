// @ts-check
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "reactionrole",
  /**
   * @param {import("discord.js").AnySelectMenuInteraction} interaction
   * @param {import("@client").BotClient} client
   */
  async executeMenu(interaction, client) {
    if (interaction.customId.split("-")[1] == "roles") {
      const roles = interaction.values;
      const message = interaction.message;

      // Create up to 5 action rows for all the roles
      // Where the button custom id is the role id
      // And the label is the role name
      const actionRows = [];
      let actionRow = new ActionRowBuilder();
      let buttons = 0;
      for (const role of roles) {
        if (buttons === 5) {
          actionRows.push(actionRow);
          actionRow = new ActionRowBuilder();
          buttons = 0;
        }
        actionRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`giverole-${role}`)
            .setLabel(interaction.guild.roles.cache.get(role).name)
            .setStyle(ButtonStyle.Secondary)
        );
        buttons++;
      }
      actionRows.push(actionRow);

      // Send the message with the buttons in the channel and delete the original message
      message.channel
        .send({
          content: message.content,
          // @ts-ignore
          components: actionRows,
        })
        .then(() => {
          interaction.message.delete();
        });
    }
  },
};
