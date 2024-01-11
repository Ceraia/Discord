module.exports = {
  async loadProducts(client) {
    let product = await client.stripe.products.list();
    product.data.forEach((p) => {
      client.products.set(p.id, { ...p, price: null });
    });

    let pricePromises = Array.from(client.products.values()).map((product) => {
      return client.stripe.prices
        .retrieve(product.default_price)
        .then((price) => {
          product.price = Number(price.unit_amount) / 100;
          return product;
        });
    });

    let productsWithPrices = await Promise.all(pricePromises);

    productsWithPrices.forEach((product) => {
      client.products.set(product.id, product);
    });
  },
};
