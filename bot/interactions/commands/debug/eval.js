const path = require("path");
const currentDirectory = path.dirname(__filename);
const parentDirectoryName = path.basename(path.dirname(currentDirectory));

module.exports = {
  name: "eval",
  aliases: [],
  slashcommand: false,
  category: parentDirectoryName,
  textcommand: true,
  async executeText(client, message, args) {
    let response = await execute(client, message);
    message.channel.send(response);
  },
};

async function execute(client, message) {
  // Check if the user is the bot owner
  if (client.settings.owner == message.author.id) {
    // Take the message content and remove the command
    let code = message.content.slice(
      client.database.get("guilds").get(message.guild.id).prefix.length + 4
    );

    try {
      return `\`${await eval(code)}\``;
    } catch (error) {
      return `\`${error.stack}\``;
    }
  } else {
    message.client.warning(
      `${message.author.username} is not in the sudoers file. This incident will be reported.`
    );
    return `${message.author.username} is not in the sudoers file. This incident will be reported.`;
  }
}
