const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
  guildId: String,
  prefix: {
    type: String,
    default: ",",
  },
  dynvcs: {
    prefix: {
      type: String,
      default: "",
    },
    overrides: {
      type: Array,
      default: [],
    },
  },
  autoroles: {
    type: Array,
    default: [],
  },
});

const guilds = model("Guild", guildSchema);

module.exports = {
  guilds,
  getGuild: async function (guildId) {
    let guild = await guilds.findOne({
      guildId,
    });
    if (!guild) {
      guild = new guilds({
        guildId,
      });
      await guild.save();
    }
    return guild;
  }
};
