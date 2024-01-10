module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (message.content.includes("831087678027202560"))
      message.channel.send("Hello, I am the cooler Brad's Network.");
    if (!message.content.startsWith(client.settings.prefix)) return;
    if (!message.member)
      message.member = await message.guild.fetchMember(message);

    const args = message.content
      .slice(client.settings.prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.textcommands.get(cmd);
    if (!command) {
      command = client.textcommands.get(client.aliases.get(cmd));
    }

    if (command) {
      command.executeText(client, message, args);
    }
  },
};
