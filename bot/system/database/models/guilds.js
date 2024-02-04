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
    this.logs = {
      channel: null,
    };
    this.giveaways = [
      // {
      //   message: null,
      //   channel: null,
      //   ends: null,
      //   owners: null,
      //   winners: 1,
      //   prize: null,
      //   prizeDesc: null,
      //   participants: [
      //     null, // User ID
      //   ],
      // },
    ];
  }
}

module.exports = GuildModel;
