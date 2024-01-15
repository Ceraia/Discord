module.exports = {
  async loadProducts(client) {
    return;
    let product = await client.stripe.products.list();
    product.data.forEach((p) => {
      client.products.set(p.id, { ...p, price: null });
    });

    let pricePromises = Array.from(client.products.values()).map((product) => {
      return client.stripe.prices
        .retrieve(product.default_price)
        .catch((err) => {
          client.error("STRIPE ERROR : " + err.stack);
        })
        .then((price) => {
          product.price = Number(price.unit_amount) / 100;
          product.price_id = price.id;
          return product;
        });
    });

    let productsWithPrices = await Promise.all(pricePromises);

    productsWithPrices.forEach((product) => {
      client.products.set(product.id, product);
    });
  },
};
