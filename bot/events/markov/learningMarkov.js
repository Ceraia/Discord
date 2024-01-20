const { Message } = require("discord.js");
const { dbGuild } = require("../../system/constructors");

// Function to update the Markov chain based on a message
function updateMarkovChain(markovChain, message) {
  const words = message.content
    .toLowerCase() //Remove all punctuation
    .replace(/[.,\/#!$%\^&\*;:{}=\\-_`~()]/g, "")
    .split(/\s+/);

  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i];
    const nextWord = words[i + 1];

    if (!markovChain[currentWord]) {
      markovChain[currentWord] = [];
    }

    markovChain[currentWord].push(nextWord);
  }
}

module.exports = {
  name: "messageCreate",
  once: false,
  /**
   *
   * @param {Message} message
   * @param {import("discord.js").Client} client
   * @returns
   */
  async execute(message, client) {
    if (message.author.bot) return;

    const guildId = message.guild.id;
    let guild = client.db.guilds.get(guildId);

    if (!guild) guild = new dbGuild(guildId);

    if (message.content.toLowerCase().startsWith(guild.prefix.toLowerCase()))
      return;

    // Get the markov chain for the guild
    const markovChain = guild.markov.chain || {};

    // Update the Markov chain with the current message
    updateMarkovChain(markovChain, message);

    // Save the updated Markov chain back to the guild object
    guild.markov.chain = markovChain;

    // Save the guild object to the database
    client.db.guilds.set(guildId, guild);
  },
};
