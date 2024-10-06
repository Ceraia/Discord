const { ChannelType } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  once: false,
  async execute(oldState, newState) {
    let client = newState.client;
    const guild = newState.guild;
    if (guild.id !== client.settings.entropy.guild) return;
    const categoryID = client.settings.entropy.dynamicVcCategoryId;

    // Fetch all voice channels within the category
    const voiceChannels = guild.channels.cache.filter(
      (channel) =>
        channel.type === ChannelType.GuildVoice &&
        channel.parentId === categoryID
    );

    let emptyChannelCount = 0;

    voiceChannels.forEach((channel) => {
      if (channel.members.size === 0) {
        if (emptyChannelCount >= 1) {
          channel.delete().catch((err) => {});
        } else {
          emptyChannelCount++;
        }
      }
    });

    // Sort channels and rename
    let n = 0;
    voiceChannels.forEach((channel) => {
      let name = `Voices${smallNumberify(n)}`;
      channel.name == name ? null : channel.setName(name);
      n++;
    });

    // Make a new channel if needed
    if (emptyChannelCount <= 0) {
      await guild.channels.create({
        name: `Voices${smallNumberify(n)}`,
        type: ChannelType.GuildVoice,
        parent: categoryID,
      });
    }
  },
};

// Function to convert numbers to superscript
function smallNumberify(input) {
  return input
    .toString()
    .replace("0", "⁰")
    .replace("1", "¹")
    .replace("2", "²")
    .replace("3", "³")
    .replace("4", "⁴")
    .replace("5", "⁵")
    .replace("6", "⁶")
    .replace("7", "⁷")
    .replace("8", "⁸")
    .replace("9", "⁹");
}
