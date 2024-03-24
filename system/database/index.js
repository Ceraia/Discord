require("dotenv").config();

require("mongoose")
  .connect(process.env.MONGOURI, {
  })
  .then(() => {
    require("../logger").log("Connected to MongoDB");
  })
  .catch((err) => {
    require("../logger").error(err.stack);
  });

module.exports = {
  guilds: require("./models/guildSchema"),
};
