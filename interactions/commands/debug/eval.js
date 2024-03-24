const { getGuild } = require("../../../system/database/models/guildSchema");

module.exports = {
  name: "eval",
  aliases: [],
  slashcommand: false,
  category: "debug",
  textcommand: true,
  async executeText(client, message, args) {
    execute(client, message);
  },
};

async function execute(client, message) {
  client.log("Executing eval command.");
  // Check if the user is the bot owner
  if (client.settings.owner == message.author.id) {
    // Format the message
    let guild = await getGuild(message.guild.id);

    // Take the message content and remove the command
    let code = message.content.replace(`${guild.prefix}eval `, "");

    client.log(`Evaluating code: ${code}`);
    try {
      return message.reply(await eval(code))
    } catch (error) {
      return client.error(error.stack);
    }
  } else {
    message.client.warning(
      `${message.author.username} is not in the sudoers file. This incident will be reported.`
    );
    return `${message.author.username} is not in the sudoers file. This incident will be reported.`;
  }
}
