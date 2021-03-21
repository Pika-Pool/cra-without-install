const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

if (
	process.argv.length <= 2 ||
	process.argv.find(arg => /--help|-help|-h/g.test(arg))
) {
	console.error(`Syntax:
	pnpm-cra <app_name> <lang>

	app_name : (REQUIRED) name of app or directory name
	lang     : (OPTIONAL) ts | --ts | --typescript | typescript
	
	app_name directory can exist already
	default lang = js, no need to specify
	`);

	process.exit(1);
}

let [, , dir, ...args] = process.argv;

// =======================================================================================

// constants
const appName = path.resolve(dir);
const packageJsonFilePath = path.join(appName, 'package.json');
const language = getLanguage(args);
const filesToCopyFromPath = path.join(__dirname, 'files');

// =======================================================================================

// get and create directory
createFolder(appName);

process.chdir(appName);

// =======================================================================================

// create package.json
if (fs.existsSync(packageJsonFilePath)) {
	console.log(`${packageJsonFilePath} already exists. Delete it first`);
	process.exit(1);
}

writeFileIfExists({
	path: packageJsonFilePath,
	source: path.join(filesToCopyFromPath, 'package.json'),
});

// =======================================================================================

// npm init
const execOut = execSync('npm init -y');
console.log(execOut.toString());

// =======================================================================================

// create src & public
createFolder('src');
createFolder('public');

// =======================================================================================

// create gitignore
writeFileIfExists({
	path: '.gitignore',
	source: path.join(filesToCopyFromPath, '.gitignore'),
});

// =======================================================================================

// create .env file
writeFileIfExists({
	path: '.env',
	data: 'BROWSER=none',
});

// =======================================================================================

// create index.html
writeFileIfExists({
	path: 'public/index.html',
	source: path.join(filesToCopyFromPath, 'index.html'),
});

// create index.css file
writeFileIfExists({
	path: 'src/index.css',
	source: path.join(filesToCopyFromPath, 'index.css'),
});

// =======================================================================================

// language specific actions
if (language === 'javascript')
	require('./js.js')({
		writeFileIfExists,
		filesToCopyFromPath,
	});
else if (language === 'typescript')
	require('./ts.js')({
		writeFileIfExists,
		filesToCopyFromPath,
	});

// =======================================================================================

// utils
function createFolder(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

function writeFileIfExists({ path, data, source }) {
	if (!fs.existsSync(path)) {
		if (source) {
			// asynchronous method
			// fs.createReadStream(source).pipe(fs.createWriteStream(path));
			fs.copyFileSync(source, path);
		} else if (typeof data === 'string') {
			fs.writeFileSync(path, data);
		} else {
			throw new Error('either send data or a source file to copy from');
		}
	}
}

// check ts/js
function getLanguage(args) {
	return args.find(arg =>
		['ts', '--ts', '--typescript', 'typescript'].includes(arg)
	)
		? 'typescript'
		: 'javascript';
}
