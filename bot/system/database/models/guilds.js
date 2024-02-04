const settings = require("../../../settings");

class GuildModel {
  constructor() {
    this.id = null;
    this.prefix = settings.prefix;
    this.dynvcs = {
      prefix: "",
      overrides: [],
    };
    this.members = {};
    this.welcome = {
      enabled: false,
      channel: null,
      message: null,
      embed: null,
    };
    this.joinRoles = [];
    this.stickyRoles = {
      enabled: false,
      blacklist: [],
      users: {},
    };
  }
}

module.exports = GuildModel;
