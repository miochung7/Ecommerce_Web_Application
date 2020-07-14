const Repository = require('./repository');

class ProductsRepository extends Repository {}

// Creates instance of ProductsRepository - so that theres no possibilty of misspelling products.json

module.exports = new ProductsRepository('products.json'); // Saves all this data to products.json file
