const { Message, ActionRowBuilder, ButtonBuilder } = require("discord.js");

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
    const guild = client.db.guilds.get(guildId);

    if (!guild) return;

    if (!guild.markov.enabled) return;

    // Get the markov chain for the guild
    const markovChain = guild.markov.chain || {};

    // Pick a random word from the markov chain
    let words = Object.keys(markovChain);
    let word = words[Math.floor(Math.random() * words.length)];

    // Start the sentence with the random word
    let sentence = word;

    // Generate a sentence
    for (let i = 0; i < Math.random() * 25 * 8; i++) {
      if (!markovChain[word]) break;

      // Get the next word
      let nextWord =
        markovChain[word][Math.floor(Math.random() * markovChain[word].length)];
      // Add the next word to the sentence
      sentence += ` ${nextWord}`;
      // Set the current word to the next word
      word = nextWord;
    }

    // Add a random . ! or ? to the end of the sentence
    sentence += [
      ".",
      "!",
      "?",
      ", twinkie.",
      ", twinkie!",
      "...",
      " twinkie says.",
      ", twinkie says.",
      ", twinkie wants.",
      "",
      "",
    ][Math.floor(Math.random() * 11)];

    // Capitalize all standalone I's
    sentence = sentence.replace(/\si\s/g, " I ");

    // Capitalize the first letter of the sentence
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);

    // Send the sentence 1 out of 10 times
    if (
      Math.floor(Math.random() * 10) == 0 ||
      message.mentions.has(client.user.id)
    ) {
      message.channel.send({
        content: sentence,
        allowedMentions: { parse: [] },
        tts: Math.floor(Math.random() * 10) == 0,
      });
    }
  },
};
