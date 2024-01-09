const axios = require("axios");
const settings = require("../settings.js");
const { EmbedBuilder } = require("@discordjs/builders");

// Send messages to the console for logging.
async function log(message) {
  console.log(`\x1b[32m[SYSTEM]\x1b[0m ${message}`);
  send("`[SYSTEM]` " + message, 0x00ff00);
}

async function debug(message) {
  console.log(`\x1b[33m[DEBUG]\x1b[0m ${message}`);
  send("`[DEBUG]` " + message, 0xffff00);
}

async function error(message) {
  console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`);
  send("`[ERROR]` " + message, 0xff0000);
}

async function warning(message) {
  console.log(`\x1b[33m[WARNING]\x1b[0m ${message}`);
  send("`[WARNING]` " + message, 0xffff00);
}

async function send(message, color) {
  let embed = new EmbedBuilder().setDescription(message).setColor(color);
  webhook(settings.webhook, { embeds: [embed] }).catch(() => {
    // If it fails to send the message, retry after 5 seconds
    setTimeout(() => {
      send(message, color);
    }, 5000);
  });
}

async function webhook(webhookUrl, message) {
  try {
    await axios.post(webhookUrl, message);
  } catch (error) {}
}

module.exports = {
  log,
  debug,
  error,
  warning,
  webhook,
};
