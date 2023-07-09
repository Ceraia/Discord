const { setVoiceChannelName, getMemberStats } = require("@utils/guildUtils");
const { getSettings } = require("@schemas/Guild");
const { config } = require("dotenv");

/**
 * Updates the counter channel for all the guildId's present in the update queue
 * @param {import('@src/structures').BotClient} client
 */

function channelFunction(vc, name, guild, settings, config) {
  const all = guild.memberCount;
  const bots = settings.data.bots;
  const members = all - bots;
  //config.counter_type.toUpperCase();

  vcName = [];
  name.split(" ").forEach((word) => {
    if (!isNaN(word))
      vcName.push(
        config.counter_type.toUpperCase() === "USERS"
          ? `${all}`
          : config.counter_type.toUpperCase() === "MEMBERS"
          ? `${members}`
          : `${bots}`
      );
    else vcName.push(word);
  });
  return setVoiceChannelName(vc, vcName.join(" "));
}

async function updateCounterChannels(client) {
  client.counterUpdateQueue.forEach(async (guildId) => {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    try {
      const settings = await getSettings(guild);

      const all = guild.memberCount;
      const bots = settings.data.bots;
      const members = all - bots;

      for (const config of settings.counters) {
        const chId = config.channel_id;
        const vc = guild.channels.cache.get(chId);
        if (!vc) continue;

        let channelName;

        if (1 == 2) {
          //Using regex, which fails.
          if (config.counter_type.toUpperCase() === "USERS") channelName = `${vc.name.replace(/^\D+/g, `${all}`)}`;
          if (config.counter_type.toUpperCase() === "MEMBERS")
            channelName = `${vc.name.replace(/^\D+/g, `${members}`)}`;
          if (config.counter_type.toUpperCase() === "BOTS") channelName = `${vc.name.replace(/^\D+/g, `${bots}`)}`;
        }

        //config.counter_type.toUpperCase()

        //if (config.counter_type.toUpperCase() === "USERS") channelName = setVoiceChannelName(vc, channelName);

        channelFunction(vc, vc.name, guild, settings, config);
      }
    } catch (ex) {
      client.logger.error(`Error updating counter channels for guildId: ${guildId}`, ex);
    } finally {
      // remove guildId from cache
      const i = client.counterUpdateQueue.indexOf(guild.id);
      if (i > -1) client.counterUpdateQueue.splice(i, 1);
    }
  });
}

/**
 * Initialize guild counters at startup
 * @param {import("discord.js").Guild} guild
 * @param {Object} settings
 */
async function init(guild, settings) {
  if (settings.counters.find((doc) => ["MEMBERS", "BOTS"].includes(doc.counter_type.toUpperCase()))) {
    const stats = await getMemberStats(guild);
    settings.data.bots = stats[1]; // update bot count in database
    await settings.save();
  }

  // schedule for update
  if (!guild.client.counterUpdateQueue.includes(guild.id)) guild.client.counterUpdateQueue.push(guild.id);
  return true;
}

module.exports = { init, updateCounterChannels };
