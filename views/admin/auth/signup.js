const layout = require('../layout');
const { getError } = require('../../helpers');

module.exports = ({ req, errors }) => {
	// Receiving obj that has req property that contains req obj from our route handler
	// Future - can add in many arguments to my templating func without having to add arg1, arg2 etc...
	return layout({
		content: `
        <div class="container">
          <div class="columns is-centered">
            <div class="column is-one-quarter">
              <form method="POST">
                <h1 class="title">Sign Up</h1>
                <div class="field">
                  <label class="label">Email</label>
                  <input required class="input" placeholder="Email" name="email" />
                  <p class="help is-danger">${getError(errors, 'email')}</p>
                </div>
                <div class="field">
                  <label class="label">Password</label>
                  <input required class="input" placeholder="Password" name="password" type="password" />
                  <p class="help is-danger">${getError(errors, 'password')}</p>
                </div>
                <div class="field">
                  <label class="label">Password Confirmation</label>
                  <input required class="input" placeholder="Password Confirmation" name="passwordConfirmation" type="password" />
                  <p class="help is-danger">${getError(
						errors,
						'passwordConfirmation'
					)}</p>
                </div>
                <button class="button is-primary">Submit</button>
              </form>
              <a href="/signin">Have an account? Sign In</a>
            </div>
          </div>
        </div>
      `
	});
};

// WHenever we call this func, we need to pass in req obj in order for template to render properly
