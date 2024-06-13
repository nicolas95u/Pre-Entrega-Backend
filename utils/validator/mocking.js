const faker = require('@faker-js/faker');

const generateMockProducts = () => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.datatype.uuid(),
      price: faker.commerce.price(),
      status: faker.datatype.boolean(),
      stock: faker.datatype.number({ min: 0, max: 100 }),
      category: faker.commerce.department(),
      thumbnails: [faker.image.imageUrl()],
    });
  }
  return products;
};

module.exports = generateMockProducts;
