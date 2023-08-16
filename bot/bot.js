require("dotenv").config();
require("module-alias/register");
require("@src/helpers/extenders");

const path = require("path");
const { validateConfig } = require("@utils/botUtils");
const { initializeMongoose } = require("@src/database/mongoose");
const { BotClient } = require("@src/structures");
const fs = require("fs");

global.__appRoot = path.resolve(__dirname);

// initialize client
const client = new BotClient();
client.loadCommands("src/commands");
client.loadContexts("src/contexts");
client.loadEvents("src/events");
client.snipes = new Map();

// MARKOV

// File path for the Markov data JSON file
const dataFilePath = "markov_data.json";

// Load existing Markov data if available
let markovChain = {};

try {
  const data = fs.readFileSync(dataFilePath, "utf-8");
  markovChain = JSON.parse(data);
} catch (error) {
  console.log("No existing Markov data found.");
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith("!forcemarkovbatchlearning")) {
    let args = message.content.split(" ");
    let numMessages = args[1];
    if (numMessages > 100) {
      message.reply("Max 100 messages");
      return;
    }
    let channel = message.channel;
    channel.messages.fetch({ limit: numMessages }).then((messages) => {
      messages.forEach((message) => {
        if (message.author.bot) return;

        // Process the message content and update the Markov chain
        const words = message.content.split(" ");
        for (let i = 0; i < words.length - 1; i++) {
          const currentWord = words[i];
          const nextWord = words[i + 1];

          if (!markovChain[currentWord]) {
            markovChain[currentWord] = [];
          }

          markovChain[currentWord].push(nextWord);
        }
      });
      saveMarkovData(markovChain);
    });
  } else {
    trainOnMessage(message);

    if (
      message.content.includes("<@!758776071268859946>") ||
      message.content.includes("<@758776071268859946>") ||
      Math.random() < 0.1
    ) {
    }
    const generatedResponse = generateResponse(markovChain);
    message.reply(generatedResponse);
  }
});

function trainOnMessage(message) {
  // Process the message content and update the Markov chain
  const words = message.content.split(" ");
  for (let i = 0; i < words.length - 1; i++) {
    const currentWord = words[i];
    const nextWord = words[i + 1];

    if (!markovChain[currentWord]) {
      markovChain[currentWord] = [];
    }

    markovChain[currentWord].push(nextWord);
  }

  // Save the updated Markov data to the JSON file
  saveMarkovData(markovChain);
}

function generateResponse(chain) {
  const startingWord = getRandomWord(Object.keys(chain));
  const maxWords = 20; // Limit the response to a certain number of words
  let response = startingWord;

  for (let i = 0; i < maxWords; i++) {
    const nextWords = chain[response.split(" ").slice(-1)[0]];

    if (nextWords && nextWords.length > 0) {
      const randomNextWord = getRandomWord(nextWords);
      response += " " + randomNextWord;
    } else {
      break;
    }
  }

  return response;
}

function getRandomWord(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function saveMarkovData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf-8");
  console.log("Markov data saved.");
}

// MARKOV END

// find unhandled promise rejections
process.on("unhandledRejection", (err) => client.logger.error(`Unhandled exception`, err));

(async () => {
  validateConfig();

  // initialize the database//4/2
  await initializeMongoose();

  // start the dashboard
  if (client.config.DASHBOARD.enabled) {
    client.logger.log("Launching dashboard");
    try {
      const { launch } = require("@root/dashboard/app");
      await launch(client);
    } catch (ex) {
      client.logger.error("Failed to launch dashboard", ex);
    }
  }

  // start the client
  await client.login(process.env.BOT_TOKEN);
})();
