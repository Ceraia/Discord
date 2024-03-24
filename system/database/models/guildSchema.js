const { Schema, model } = require("mongoose");

const guildSchema = new Schema({
  guildId: String,
  prefix: {
    type: String,
    default: ",",
  },
});

const guilds = model("Guild", guildSchema);

module.exports = guilds;
