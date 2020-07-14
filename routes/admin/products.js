// From external library
const express = require('express');
const multer = require('multer');

// From our own files
const { handleErrors, requireAuth } = require('./middlewares');
const productsRepo = require('../../repositories/products');
const productsNewTemplate = require('../../views/admin/products/new');
const productsIndexTemplate = require('../../views/admin/products/index');
const productsEditTemplate = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');
const products = require('../../repositories/products');

// Declaring variables and to make use of libraries
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Can make use of upload middleware func

// Lists out all products to admin user
router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsIndexTemplate({ products })); // passes in object
});

// Showing form to create new products
router.get('/admin/products/new', requireAuth, (req, res) => {
	res.send(productsNewTemplate({}));
});

// Submits the form
router.post(
	'/admin/products/new',
	requireAuth,
	upload.single('image'), // now overwrites body-parser and multer app parses text in req.body, so can access req.body
	[
		requireTitle,
		requirePrice
	],
	handleErrors(productsNewTemplate),
	async (req, res) => {
		/*
        To get all errors from incoming request,we have to require in file
        the validationResult func from express-validator library
        validationResult - will take in a req and gives back errors obj
        */

		// req.file uploaded turn into string, stored in product.json file
		// Takes the string and create a new record using products.js in repo and saves in products.json

		const image = req.file.buffer.toString('base64'); // a string encodes the raw buffer data in base64 format
		const { title, price } = req.body;
		await productsRepo.create({ title, price, image }); // Saves title, price and image properties in products.json file

		res.redirect('/admin/products');
	}
);

router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
	const product = await productsRepo.getOne(req.params.id); // Finds the id in Products repo

	if (!product) {
		return res.send('Product not found');
	}
	// A user may bookmark the page to edit, or a user may have made a typo on URL after the product was deleted so we may not find that product
	res.send(productsEditTemplate({ product }));
});

router.post(
	'/admin/products/:id/edit',
	requireAuth,
	upload.single('image'),
	[
		requireTitle,
		requirePrice
	],
	handleErrors(productsEditTemplate), // only passes through error obj, has no products to pass in if have any errors so will need to redit this later
	async (req, res) => {
		const changes = req.body;
		if (req.file) {
			// If a file was provided
			changes.image = req.file.buffer.toString('base64'); // Takes array of raw data, encode to base64 string
		}

		try {
			await productsRepo.update(req.params.id, changes); // id - id we want to update from URL, changes - the object with all changes we want to apply
		} catch (err) {
			return res.send('Could not find item'); // Will add text onto current product form than showing plain text
		}
		res.redirect('/admin/products');
	}
);

/* 
handleErrors()
Sends a reference to the func, invokes to throw in template that we want to eventually use
the handleError middleware returns a func which watches for any errors everytime we have an incoming request to application
*/

module.exports = router;
