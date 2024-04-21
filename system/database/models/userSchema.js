// @ts-check
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  userId: String,
});

const users = model("User", userSchema);

module.exports = {
  users,
  getUser: async function (userId) {
    let user = await users.findOne({
      userId,
    });
    if (!user) {
      user = new users({
        userId,
      });
      await user.save();
    }
    return user;
  },
};
