const { counterHandler, inviteHandler } = require("@src/handlers");
const { cacheReactionRoles } = require("@schemas/Message");
const { getSettings } = require("@schemas/Guild");
const { updateCounterChannels } = require("@src/handlers/counter");
const { PRESENCE } = require("@root/config");
const { oneLine } = require("common-tags");
const { MessageEmbed, MessageActionRow } = require("discord.js");

/**
 * @param {import('@src/structures').BotClient} client
 */
module.exports = async (client) => {
  client.logger.success(`Logged in as ${client.user.tag}! (${client.user.id})`);

  // Update Bot Presence
  if (PRESENCE.ENABLED) {
    updatePresence(client);
    setInterval(() => updatePresence(client), 0.5 * 60 * 1000);
  }

  // Register Interactions
  if (client.config.INTERACTIONS.SLASH || client.config.INTERACTIONS.CONTEXT) {
    if (client.config.INTERACTIONS.GLOBAL) await client.registerInteractions();
    else await client.registerInteractions(client.config.INTERACTIONS.TEST_GUILD_ID);
  }

  // Load reaction roles to cache
  await cacheReactionRoles(client);

  for (const guild of client.guilds.cache.values()) {
    const settings = await getSettings(guild);

    // initialize counter
    if (settings.counters.length > 0) {
      await counterHandler.init(guild, settings);
    }

    // cache invites
    if (settings.invite.tracking) {
      inviteHandler.cacheGuildInvites(guild);
    }
  }

  setInterval(() => updateCounterChannels(client), 15 * 60 * 1000);
};

/**
 * @param {import('@src/structures').BotClient} client
 */
const updatePresence = (client) => {
  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: `${client.guilds.cache
          .map((g) => g.memberCount)
          .reduce((partial_sum, a) => partial_sum + a, 0)} members in ${client.guilds.cache.size} guilds.`,
        type: "WATCHING",
      },
    ],
  });

  let component = new MessageActionRow().addComponents([
    {
      type: "BUTTON",
      label: "commissions",
      style: "SECONDARY",
      customId: "commissions",
      disabled: true,
    },
    {
      type: "BUTTON",
      label: "xdbl.dev",
      style: "LINK",
      url: "https://xdbl.dev/",
    },
  ]);

  client.channels.cache
    .get("984577135761043508")
    .messages.fetch("1127170813028745236")
    .then((m) => {
      m.edit({
        content: "** **",
        embeds: [
          (embedTitle = new MessageEmbed()
            .setTitle("xdbl.dev")
            .setDescription(
              "Welcome to the Axo's Vault, here you can find Axo's services, bots and other content.\n\nCommissions have been closed."
            )
            .setColor("9A9A9A")),
        ],
        components: [component],
      });
    });
};
