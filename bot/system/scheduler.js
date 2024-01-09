async function loadScheduler(client) {
  client.log("Loaded scheduler.");
}

// async function metricsUpdate(client) {
//   //Run the update metrics function every 5 minutes
//   await updateActivityMetrics(client);
//   setInterval(async () => {
//     await updateActivityMetrics(client);
//   }, 2 * 60 * 1000);
// }

module.exports = {
  loadScheduler,
};
