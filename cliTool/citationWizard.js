'use strict';

let CitationCore = require('../core/citationCore');
let ArgumentParser = require('./argumentParser');

try {
	let args = process.argv.slice(2);
	let formatOptions = ArgumentParser.parse(args);

	CitationCore.generate(formatOptions, (citationStr, errors) => {
		errors.forEach((obj) => {
			console.log(obj.message);
		});

		if(citationStr != null) {
			console.log(citationStr);
		}
	});
}
catch(e) {
	console.log(e.message);
	console.log(e.stack);
}
