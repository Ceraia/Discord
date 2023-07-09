const { Command } = require("@src/structures");
const { Message, CommandInteraction } = require("discord.js");
const { getUser } = require("@schemas/User");

function ignore(user) {
  const userData = getUser(user.id);
  userData.reputation.ignore = true ? false : true;
  userData.save();
  return (userData.reputation.ignore = true ? "Enabled" : "Disabled");
}

module.exports = class IgnoreCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ignore",
      description: "lets you ignore automated system messages for yourself",
      category: "INFORMATION",
      command: {
        enabled: true,
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
    result = ignore(message.author);
    message.safeReply(`${result} disabled automated system notifications for you.`);
  }

  /**
   * @param {CommandInteraction} interaction
   */
  async interactionRun(interaction) {
    result = ignore(interaction.user);
    interaction.followUp(`${result} automated system notifications for you.`);
  }
};
