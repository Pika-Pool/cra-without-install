const path = require('path');

module.exports = ({ writeFileIfExists, filesToCopyFromPath }) => {
	// create index.js file
	writeFileIfExists({
		path: 'src/index.tsx',
		source: path.join(filesToCopyFromPath, 'ts/index.tsx'),
	});

	// create App.js
	writeFileIfExists({
		path: 'src/App.tsx',
		source: path.join(filesToCopyFromPath, 'ts/App.tsx'),
	});

	// create index.css file
	writeFileIfExists({ path: 'src/index.css', data: '' });

	// create tsconfig.json file
	writeFileIfExists({
		path: 'tsconfig.json',
		source: path.join(filesToCopyFromPath, 'ts/tsconfig.json'),
	});

	// pnpm command
	console.log('The pnpm command\n');
	console.log(
		'\tpnpm add @types/node @types/react @types/react-dom react react-dom react-scripts typescript'
	);
};
