const fs = require('fs');
const crypto = require('crypto');

const util = require('util'); // In Native Node Library, can use promisfy based func
const scrypt = util.promisify(crypto.scrypt); // Pass a func that receives a callback and gives back a new version of func that returns a promise
const Repository = require('./repository');

/*
constructor functions gets called instantly whenever we create new instance of the class
filename - is name of file we will store all of the different users/products into

*/
class UsersRepository extends Repository {
	async create(attributes) {
		// Will be an obj {email: 'mio@gmail.com', password: 'asfiHgoiwfg'}
		attributes.id = this.randomId(); // Adds ID property and also generates random ID

		const salt = crypto.randomBytes(8).toString('hex'); // Generates SALT password
		const buffer = await scrypt(attributes.password, salt, 64); // Returns promise which is a raw buffer data to be received from scrypt. Adds SALT password to password supplied by user

		const records = await this.getAll(); // load up contents of users.json to have most recent data avail
		const record = {
			...attributes, // overwrites the existing properties in attributes obj with new password below
			password: `${buffer.toString('hex')}.${salt}` // This is our hashed password converted from raw buffer to hexadecimal string separated with . - Stores also SALT password
		};

		records.push(record); // Push in the new user
		await this.writeAll(records);

		return record; // Returns HASH & SALT password
	}

	async comparePasswords(saved, supplied) {
		// compaeres saved password saved in database and password given by user who tries to sign in
		// Will get back an array with 2 elements inside which are strings - First element is assigned to variable called HASHED, second is SALT
		const [
			hashed,
			salt
		] = saved.split('.'); // Destructured array
		const hashedSuppliedBuffer = await scrypt(supplied, salt, 64); // Adds SALT password to supplied password - returns a RAW buffer array

		return hashed === hashedSuppliedBuffer.toString('hex'); // Turns RAW buffer to hexadecimal string & compares and returns true/false
	}
}

module.exports = new UsersRepository('users.json');

/*   TESTING AREA


To test - need to use for node.js async/await in async func
In ECMAscript it allows you to write like this https://v8.dev/features/top-level-await#:~:text=Top%2Dlevel%20await%20enables%20developers,they%20start%20evaluating%20their%20body.

*/

// const test = async () => {
//     const repo = new UsersRepository('users.json'); // Access to usersRepository
//     const user = await repo.getOneBy({
//         email: 'test@test.com',
//         password: 'dfa'
//     })
//     console.log(user);

// }

// test();
