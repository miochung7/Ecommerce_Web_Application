const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
	// UsersRepository will have hard drive to store all information in users.json file.
	// See if file has already been created to store info, if not will create the file
	constructor(filename) {
		if (!filename) {
			throw new Error('Creating a respository requires a filename');
		}
		// stores filename in instance variable
		this.filename = filename;
		try {
			fs.accessSync(this.filename); // checks if filename exists
		} catch (err) {
			// if no filename then will create file
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async create(attributes) {
		attributes.id = this.randomId();

		const records = await this.getAll();
		records.push(attributes); // Adds new attribute with id attached
		await this.writeAll(records); // Updates records array and turns JS object to JSON data string

		return attributes;
	}

	async getAll() {
		// Opens this.filename,store all users as JSON data string, so need to parse it from JSON data string into an array of JS object
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8'
			})
		);
	}

	// Nice helper function

	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2) // Turns JS object to JSON data string updates records array back to users.json file
		);
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filteredRecords = records.filter((record) => record.id !== id); // If id matches it will not be included in filteredRecords. Will return true if ID is not same as id passed in. Filter function only retains elements that return true.
		await this.writeAll(filteredRecords); // Passes filteredRecords and saves it back into users.json file
	}

	async update(id, attributes) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		// check if we found a record
		if (!record) {
			throw new Error(`Record with id ${id} not found`);
		}
		/* // Takes all properties and key/value pairs in attributes and COPIES them into record obj
        record === {email: 'test@test.com'}
        attributes === {password: 'mypassword'}
        */
		Object.assign(record, attributes); // record now equals {email: 'test@test.com', password: 'mypassword}
		await this.writeAll(records); // Updates all of records in users.json file
	}

	async getOneBy(filters) {
		const records = await this.getAll();
		for (let record of records) {
			let found = true;

			for (let key in filters) {
				// Using for in loop as it is object
				filters[key]; // Can see the value inside of each key
				if (record[key] !== filters[key]) {
					// Means if filters obj key is different to record key, will amend found to false. We didn't find find the record
					found = false;
				}
			}

			if (found) {
				// If found is true, means we found the record as all keys/values in filters obj and record are the same
				return record;
			}
			/* Filter through filters obj - looks at every key/value pair. For every key, will compare value to value of record object 
            If not the same, will update found to false. If the same then won't update found.
            If found is still equal to true after the iteration, means we must have found the record we're looking for. So will immediately return it
            */
		}
	}
};
