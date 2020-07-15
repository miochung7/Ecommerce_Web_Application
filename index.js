const express = require('express');
const bodyParser = require('body-parser'); // is a middleware function
const cookieSession = require('cookie-session'); // is a middleware function

const repo = require('./repositories/users.js');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express(); // Creates app object

// Another middleware from express library
app.use(express.static('public')); // Tells express to look inside current dir, find public folder and make it all available to the outside world

app.use(
	// Looks at incoming POST request and stores as JS object, reads form's input if it has URL encoded body which only works with default forms, it will parse bodies from URL for us before sending to our route handlers. Won't work with multipart forms
	bodyParser.urlencoded({
		// .use -
		extended: true
	})
);
app.use(
	cookieSession({
		// config object
		keys: [
			'ansjdueyf'
		] // Encrypts info stored in cookie
	})
);

app.use(authRouter); // Links up auth.js file router to app obj
app.use(productsRouter); // Links up products.js file router to app

app.listen(process.env.PORT, () => {
	// 3000 is the port number
	console.log('LISTENING');
});
