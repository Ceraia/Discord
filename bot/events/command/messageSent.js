module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    if (client.database.get("guilds"))
      if (!client.database.get("guilds").get(message.guild.id)) {
        await client.database.get("guilds").set(message.guild.id, {
          prefix: client.settings.prefix,
        });
      }

    if (
      !message.content.startsWith(
        client.database.get("guilds").get(message.guild.id).prefix
      )
    )
      return;
    if (!message.member)
      message.member = await message.guild.fetchMember(message);

    const args = message.content
      .slice(client.database.get("guilds").get(message.guild.id).prefix.length)
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
