function playerEvents(client) {
  client.player.on("error", (queue, error) => {
    client.logger.error(`Unhandled exception`, `Error emitted from the queue ${error.message}`);
  });

  client.player.on("connectionError", (queue, error) => {
    client.logger.error(`Unhandled exception`, `Error emitted from the connection ${error.message}`);
  });

  client.player.on("trackStart", (queue, track) => {
    if (queue.repeatMode !== 0) return;
    queue.metadata.send(`Started playing ${track.title} in **${queue.connection.channel.name}**.`);
  });

  // client.player.on("trackAdd", (queue, track) => {
  //   let queueCheck = player.getQueue(queue.guild.id);
  //   if (queueCheck.tracks[0]) queue.metadata.send(`Track ${track.title} added in the queue.`);
  // });

  client.player.on("botDisconnect", (queue) => {
    queue.metadata.send("I was manually disconnected from the voice channel, clearing queue.");
  });

  client.player.on("channelEmpty", (queue) => {
    queue.metadata.send("Nobody is in the voice channel, leaving the voice channel.");
  });

  client.player.on("queueEnd", (queue) => {
    queue.metadata.send("I finished reading the whole queue.");
  });
}
module.exports = {
  playerEvents,
};
