const { automodHandler, xpHandler } = require("@src/handlers");
const { getSettings } = require("@schemas/Guild");
const { sendMessage } = require("@utils/botUtils");
const { getMember } = require("@schemas/Member");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
  if (!message.guild || message.author.bot) return;
  const settings = await getSettings(message.guild);
  const { prefix } = settings;

  // check for bot mentions
  if (message.content.includes(`${client.user.id}`)) {
    sendMessage(message.channel, `My prefix is \`${settings.prefix}\``);
  }

  //afk checker
  if (message.mentions.members) {
    const afkMember = message.mentions.members.first();
    if (afkMember) {
      const memberData = await getMember(message.guild.id, afkMember.id);
      if (!memberData) return;
      if (!memberData.afk.afk) return;
      memberData.afk.afkSince = Date.now();
      memberData.afk.afkMessage = reason;

      //await memberData.save();
      if (memberData.afk.afkMessage !== "") endString = ` "${memberData.afk.afkMessage}"`;
      else endString = "";

      sendMessage(message.channel, `${afkMember.user.tag} is AFK since${endString}`);
    }
  }

  let isCommand = false;
  if (message.content.startsWith(prefix)) {
    const args = message.content.replace(`${prefix}`, "").split(/\s+/);
    const invoke = args.shift().toLowerCase();
    const cmd = client.getCommand(invoke);

    const data = { prefix, invoke, settings };

    // command is found
    if (cmd) {
      isCommand = true;
      cmd.executeCommand(message, args, data);
    } else {
    }
  }

  // if not a command
  if (!isCommand) {
    await automodHandler.performAutomod(message, settings);
    if (settings.ranking.enabled) xpHandler.handleXp(message);
  }
  if (message.content.toLowerCase().startsWith("slashfix")) {
    if (message.author.id !== "244173330431737866") return;
    message.delete();
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");
    const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN);
    await rest.put(
      Routes.applicationGuildCommands(message.client.user.id, message.guild.id), //Routes.applicationGuildCommands(client_id, '324195889977622530'),
      { body: {} }
    );
  }

  //replace message
  if (message.content.toLowerCase().startsWith("botplsrepeat") && message.author.id == "244173330431737866") {
    message.delete();
    let msg = message;
    msg.content = msg.content.replace("botplsrepeat", "");
    message.channel.send(msg);
  }
};
