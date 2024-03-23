const axios = require("axios");
const settings = require("../settings.js");
const { EmbedBuilder } = require("@discordjs/builders");

/**
 * @param {string} message
 */
async function log(message, sendwebhook = true) {
  console.log(`\x1b[32m[SYSTEM]\x1b[0m ${message}`);
  sendwebhook ? send("`[SYSTEM]` " + message, 0x00ff00, sendwebhook) : null;
}
/**
 * @param {string} message
 */
async function debug(message, sendwebhook = true) {
  console.log(`\x1b[33m[DEBUG]\x1b[0m ${message}`);
  sendwebhook ? send("`[DEBUG]` " + message, 0xffff00, sendwebhook) : null;
}
/**
 * @param {string} message
 */
async function error(message, sendwebhook = true) {
  console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`);
  sendwebhook ? send("`[ERROR]` " + message, 0xff0000, sendwebhook) : null;
}
/**
 * @param {string} message
 */
async function warning(message, sendwebhook = true) {
  console.log(`\x1b[33m[WARNING]\x1b[0m ${message}`);
  sendwebhook ? send("`[WARNING]` " + message, 0xffff00, sendwebhook) : null;
}

/**
 * @param {string} message
 * @param {number} color
 */
async function send(message, color) {
  let embed = new EmbedBuilder().setDescription(message).setColor(color);
  webhook(settings.webhook, { embeds: [embed] }).catch(() => {
    // If it fails to send the message, retry after 5 seconds
    setTimeout(() => {
      send(message, color);
    }, 5000);
  });
}

/**
 * @param {string} webhookUrl
 * @param {object} message
 */
async function webhook(webhookUrl, message) {
  try {
    await axios.post(webhookUrl, message);
  } catch (error) {
    error(`Failed to post webhook.\n${error.stack}`, false);
  }
}

module.exports = {
  log,
  debug,
  error,
  warning,
  webhook,
};
