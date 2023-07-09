const { ShardingManager } = require("discord.js");
const cluster = require("cluster");
require("dotenv").config();

const manager = new ShardingManager("./bot.js", {
  token: process.env.BOT_TOKEN,
  totalShards: "auto",
  respawn: true,
});

if (cluster.isMaster) {
  cluster.fork();
  cluster.on("exit", function (worker, code, signal) {
    cluster.fork();
  });
}

if (cluster.isWorker) {
  manager.spawn().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
