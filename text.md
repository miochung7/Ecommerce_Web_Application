// Manual helper function - MIDDLEWARE function in express terms

// HELPER FUNCTION (MIDDLEWARE FUNCTION in express term) - always called with same 3 arguments (req, res, next) next is express framework

bodyParser = (req, res, next) => {
	if (req.method === 'POST') {
		// get access to email, password, passwordConfirmation
		req.on('data', (data) => {
			const parsed = data.toString('utf8').split('&'); // Ex looks like ["email=dfg", "password=adf", "passwordConfirmation=adf"]
			const formData = {}; // Object that will hold all information inside the body of request
			for (let pair of parsed) {
				// Loop over each grouping of strings
				const [
					key,
					value
				] = pair.split('='); // Ex looks like ["email=dfg", "password=adf", "passwordConfirmation=adf"] using ES2015 desctructing
				formData[key] = value;
			}
			req.body = formData; // Will take all of form data and assign to body prop of request
			next(); // this will signify it is all done with processing.
		});
	} else {
		next();
	}
};

