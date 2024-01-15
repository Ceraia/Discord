module.exports = {
  name: "eval",
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
  // Check if the user is the bot owner
  if (client.settings.owner == message.author.id) {
    // Take the message content and remove the command
    let code = message.content.replace(`${client.settings.prefix}eval `, "");

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
