// funcs to reuse on all of our different templates

module.exports = {
	getError(errors, propertyName) {
		// propertyName  ==== 'email' || 'password || 'passwordConfirmation'
		try {
			return errors.mapped()[propertyName].msg; // errors.mapped - takes the errors array and gives back as obj. The keys will be the field names of input and values are the
		} catch (err) {
			// catch any errors that doesn't exist so just return nothing
			return '';
		}
	}
};
