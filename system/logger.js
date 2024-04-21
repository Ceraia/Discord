// @ts-check
/**
 * @param {string} message
 */
async function log(message, sendwebhook = true) {
  console.log(`\x1b[32m[SYSTEM]\x1b[0m ${message}`);
}
/**
 * @param {string} message
 */
async function debug(message, sendwebhook = true) {
  console.log(`\x1b[33m[DEBUG]\x1b[0m ${message}`);
}
/**
 * @param {string} message
 */
async function error(message, sendwebhook = true) {
  console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`);
}
/**
 * @param {string} message
 */
async function warning(message, sendwebhook = true) {
  console.log(`\x1b[33m[WARNING]\x1b[0m ${message}`);
}

module.exports = {
  log,
  debug,
  error,
  warning,
};
