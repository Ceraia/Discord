require("dotenv").config();

require("mongoose")
  .connect(process.env.MONGOURI, {
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

module.exports = {
  guilds: require("./models/guildSchema"),
};
