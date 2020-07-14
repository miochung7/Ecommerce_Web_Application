// Locate all middlewares inside routes/admin folder and tie it admin panel

const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc) {
		return (req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.send(templateFunc({ errors }));
			}

			next(); // Will be called when there is no errors. Everything went well, so calls the next middleware/invoke route handler.
		};
	},
	requireAuth(req, res, next) {
		if (!req.session.userId) {
			return res.redirect('/signin');
		}

		next();
	}
};

/*
receives templatefunc as an arg
This will be our middleware function
Returns a function automatically by express with req, res and next func, all middlewares must be functions
Next - will be called if everything worked out fine and userId was defined

requireAuth()
checks if req.session.userId is defined - checks if userId is stored on user's cookie.
*/
