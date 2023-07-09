const { Command } = require("@src/structures");
const { MessageEmbed, Message, CommandInteraction } = require("discord.js");
const { EMBED_COLORS } = require("@root/config.js");

module.exports = class SnipeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "snipe",
      description: "snipes a deleted message",
      cooldown: 5,
      category: "FUN",
      botPermissions: ["EMBED_LINKS", "MANAGE_WEBHOOKS"],
      command: {
        enabled: true,
        usage: "<snipe>",
        minArgsCount: 0,
      },
      slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [],
      },
    });
  }

  /**
   * @param {Message} message
   * @param {string[]} args
   */
  async messageRun(message, args) {
    var snipe = message.client.snipes.get(interaction.channel.id);
    if (!snipe) return message.safeReply("There is no message to snipe.");

    const embed = new MessageEmbed()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setDescription(`**Message sniped by ${message.author.tag}**`);

    message.channel
      .createWebhook(`${snipe.namestring} sniped!`, {
        avatar: snipe.avatar,
      })
      .then((webhook) => {
        webhook.send({ content: snipe.content, embeds: [embed] }).then(() => {
          webhook.delete();
        });
      });
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async interactionRun(interaction) {
    var snipe = interaction.client.snipes.get(interaction.channel.id);
    if (!snipe) return interaction.followUp("There is no message to snipe.");

    const embed = new MessageEmbed()
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setDescription(`**Message sniped by ${interaction.user.tag}.**`);

    interaction.channel
      .createWebhook(`${snipe.namestring}`, {
        avatar: snipe.avatar,
      })
      .then((webhook) => {
        webhook.send({ content: snipe.content, embeds: [embed] }).then(() => {
          webhook.delete();
        });
      });
    await interaction.followUp("Alright. I sniped that message for you.");
  }
};
