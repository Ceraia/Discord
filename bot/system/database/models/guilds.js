// models/guilds.js

const settings = require("../../../settings");

class GuildModel {
  constructor() {
    this.id = null;
    this.prefix = settings.prefix;
    this.dynvcs = {
      enabled: false,
    };
  }
}

module.exports = GuildModel;
