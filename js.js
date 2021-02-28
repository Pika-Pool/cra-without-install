const path = require('path');

module.exports = ({ writeFileIfExists, filesToCopyFromPath }) => {
	// create index.js file
	writeFileIfExists({
		path: 'src/index.js',
		source: path.join(filesToCopyFromPath, 'js/index.js'),
	});

	// create App.js
	writeFileIfExists({
		path: 'src/App.js',
		source: path.join(filesToCopyFromPath, 'js/App.js'),
	});

	// create index.css file
	writeFileIfExists({ path: 'src/index.css', data: '' });

	// pnpm command
	console.log('The pnpm command\n');
	console.log('\tpnpm add react react-dom react-scripts');
};
