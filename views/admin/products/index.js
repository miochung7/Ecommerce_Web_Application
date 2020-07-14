// Any lists of files, images, comments, blog posts will refer to as index
const layout = require('../layout');

module.exports = ({ products }) => {
	const renderedProducts = products
		.map((product) => {
			// Array of HTML strings
			return `
      <tr>
        <td>${product.title}</td>
        <td>${product.price}</td>
        <td>
          <a href="/admin/products/${product.id}/edit">
            <button class="button is-link">
              Edit
            </button>
          </a>
        </td>
        <td>
          <button class="button is-danger">Delete</button>
        </td>
      </tr>
    `;
		})
		.join(''); // Takes all HTML snippets above and join them together in one string

	return layout({
		content: `
      <div class="control">
        <h1 class="subtitle">Products</h1>  
        <a href="/admin/products/new" class="button is-primary">New Product</a>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          ${renderedProducts}
        </tbody>
      </table>
    `
	});
};

/*
Iterate through each product, build up HTML and show in the content
Hard to read if all HTML is written in content, so will add it before 
Use .map() - map over list of product, for each product will generate and return an array of snippets of HTML
Join the array together in one big string and show it inside 'content:'
*/
