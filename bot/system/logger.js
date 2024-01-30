const axios = require("axios");
const settings = require("../settings.js");
const { EmbedBuilder } = require("@discordjs/builders");

/**
 * @param {string} message
 */
async function log(message) {
  console.log(`\x1b[32m[SYSTEM]\x1b[0m ${message}`);
  send("`[SYSTEM]` " + message, 0x00ff00);
}
/**
 * @param {string} message
 */
async function debug(message) {
  console.log(`\x1b[33m[DEBUG]\x1b[0m ${message}`);
  send("`[DEBUG]` " + message, 0xffff00);
}
/**
 * @param {string} message
 */
async function error(message) {
  console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`);
  send("`[ERROR]` " + message, 0xff0000);
}
/**
 * @param {string} message
 */
async function warning(message) {
  console.log(`\x1b[33m[WARNING]\x1b[0m ${message}`);
  send("`[WARNING]` " + message, 0xffff00);
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
    console.error(error.stack);
  }
}

module.exports = {
  log,
  debug,
  error,
  warning,
  webhook,
};
