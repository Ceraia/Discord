const { updatePromotions } = require("../events/entropy/payroll");
const { loadProducts } = require("./stripe");

async function loadScheduler(client) {
  client.log("Loaded scheduler.");
  await productsUpdate(client);
}

async function productsUpdate(client) {
  //Run the update metrics function every 5 minutes
  await loadProducts(client);
  setInterval(async () => {
    await loadProducts(client);
  }, 60 * 60 * 1000);
}

module.exports = {
  loadScheduler,
};
