const { dbUser } = require("../../system/constructors");

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (message.author.bot) return;

    // Get the user from the database
    const userId = message.author.id;
    let user = client.db.users.get(userId);

    // If the user doesn't exist, create a new user
    if (!user) user = client.db.users.set(userId, new dbUser(userId));
  },
};
