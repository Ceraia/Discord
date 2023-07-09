const { Message, CommandInteraction } = require("discord.js");
const { Command } = require("@src/structures");
const { getMemberStats } = require("@utils/guildUtils");

module.exports = class CounterSetup extends Command {
  constructor(client) {
    super(client, {
      name: "counter",
      description: "setup counter channel in the guild",
      category: "ADMIN",
      userPermissions: ["MANAGE_GUILD"],
      botPermissions: ["MANAGE_CHANNELS"],
      command: {
        enabled: true,
        usage: "<type> <channel-name>",
        minArgsCount: 1,
      },
      slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [
          {
            name: "type",
            description: "type of counter channel",
            type: "STRING",
            required: true,
            choices: [
              {
                name: "users",
                value: "USERS",
              },
              {
                name: "members",
                value: "MEMBERS",
              },
              {
                name: "bots",
                value: "BOTS",
              },
            ],
          },
          // {
          //   name: "name",
          //   description: "name of the counter channel (use !stats to replace it with the user amount)",
          //   type: "STRING",
          //   required: true,
          // },
        ],
      },
    });
  }

  /**
   * @param {Message} message
   * @param {string[]} args
   * @param {object} data
   */
  async messageRun(message, args, data) {
    const type = args[0].toUpperCase();
    if (!type || !["USERS", "MEMBERS", "BOTS"].includes(type)) {
      return message.safeReply("Incorrect arguments are passed! Counter types: `users/members/bots`");
    }

    if (1 == 2) {
      //Old counter w/ name
      if (args.length < 2) return message.safeReply("Incorrect Usage! You did not provide name");
      args.shift();
      let channelName = args.join(" ");
    }

    //const response = await setupCounterOld(message.guild, type, channelName, data.settings);
    const response = await setupCounter(message.guild, type, message.author.id, data.settings);

    return message.safeReply(response);
  }

  /**
   * @param {CommandInteraction} interaction
   * @param {object} data
   */
  async interactionRun(interaction, data) {
    const type = interaction.options.getString("type");
    if (1 == 2) {
      //Old counter w/ name
      const name = interaction.options.getString("name");

      //const response = await setupCounterOld(interaction.guild, type.toUpperCase(), name, data.settings);
    }

    const response = await setupCounter(interaction.guild, type.toUpperCase(), interaction.user.id, data.settings);

    return interaction.followUp(response);
  }
};

async function setupCounter(guild, type, user, settings) {
  const stats = await getMemberStats(guild);

  var channelName = "Counter";

  if (type === "USERS") channelName += ` : ${stats[0]}`;
  else if (type === "MEMBERS") channelName += ` : ${stats[2]}`;
  else if (type === "BOTS") channelName += ` : ${stats[1]}`;

  const vc = await guild.channels.create(channelName, {
    type: "GUILD_VOICE",
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: ["CONNECT"],
      },
      {
        id: guild.me.id,
        allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT"],
      },
      {
        id: user,
        allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS"],
      },
    ],
  });

  const exists = settings.counters.find((v) => v.counter_type.toUpperCase() === type);
  if (exists) {
    //exists.name = name;
    exists.channel_id = vc.id;
  } else {
    settings.counters.push({
      counter_type: type,
      channel_id: vc.id,
      //name,
    });
  }

  settings.data.bots = stats[1];
  await settings.save();

  response =
    "Counter channel created! you may edit it's name as much as you wish, just keep the number of users in it!";
  return response;
}

async function setupCounterOld(guild, type, name, settings) {
  let channelName = name;
  const stats = await getMemberStats(guild);

  if (type === "USERS" && channelName.toLowerCase().includes("!stats"))
    channelName = channelName.replaceAll("!stats", stats[0]);
  else if (type === "MEMBERS" && channelName.toLowerCase().includes("!stats"))
    channelName = channelName.replaceAll("!stats", stats[2]);
  else if (type === "BOTS" && channelName.toLowerCase().includes("!stats"))
    channelName = channelName.replaceAll("!stats", stats[1]);
  if (type === "USERS") channelName += ` : ${stats[0]}`;
  else if (type === "MEMBERS") channelName += ` : ${stats[2]}`;
  else if (type === "BOTS") channelName += ` : ${stats[1]}`;

  const vc = await guild.channels.create(channelName, {
    type: "GUILD_VOICE",
    permissionOverwrites: [
      {
        id: guild.roles.everyone,
        deny: ["CONNECT"],
      },
      {
        id: guild.me.id,
        allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT"],
      },
    ],
  });

  const exists = settings.counters.find((v) => v.counter_type.toUpperCase() === type);
  if (exists) {
    exists.name = name;
    exists.channel_id = vc.id;
  } else {
    settings.counters.push({
      counter_type: type,
      channel_id: vc.id,
      name,
    });
  }

  settings.data.bots = stats[1];
  await settings.save();

  response = "Configuration saved! Counter channel created";
  if (channelName.toLowerCase().includes("!stats"))
    response += `\nReminder, if you want to change the location of the number of users/bots/members, you can use !stats in the name of the counter channel.\nEG: \`/counter type:users name:Hello! !stats Server!\``;
  return response;
}
