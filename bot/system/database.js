const fs = require("fs");
const path = require("path");

/**
 * @param {import("discord.js").Client} client
 * @param {string} database
 *
 * Returns the database object for the given database
 */
class Database {
  constructor(client) {
    this.client = client;
  }
}

module.exports = Database;
