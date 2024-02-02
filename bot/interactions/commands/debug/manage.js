const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "manage",
  aliases: [],
  slashcommand: false,
  category: "debug",
  textcommand: true,
  async executeText(client, message, args) {
    let response = await execute(client, message);
    message.channel.send(response);
  },
};

async function execute(client, message) {
  message.channel.send({
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Manage")
          .setCustomId(`manage-${message.author.id}`)
      ),
    ],
  });
}
