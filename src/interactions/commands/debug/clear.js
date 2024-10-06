module.exports = {
  name: "clear",
  aliases: [],
  category: "debug",
  textcommand: true,
  /**
   * @param {import("discord.js").Message} message
   * @param {import("@client").BotClient} client
   */
  async executeText(client, message, args) {
    let response = await execute(client, message);
    message.channel.send(response);
  },
};
/**
 * @param {import("discord.js").Message} message
 * @param {import("@client").BotClient} client
 */
async function execute(client, message) {
  // Clear all the slash commands in the guild
  if (client.settings.owner == message.author.id) {
    const commands = await client.guilds.cache
      .get(message.guild.id)
      .commands.fetch();
    commands.forEach(async (command) => {
      message.channel.send(`Deleting command ${command.name}`);
      await command.delete();
    });

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
