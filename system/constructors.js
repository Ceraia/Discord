class dbGuild {
  constructor(guildId) {
    this.guildId = guildId;
    this.prefix = "'";
    this.markov = {
      enabled: false,
      ignore: [],
      chain: {},
    };
    this.tickets = {};
  }
}

class dbUser {
  constructor(userId) {
    this.userId = userId;
    this.money = 0;
  }
}

module.exports = {
  dbGuild,
  dbUser,
};
