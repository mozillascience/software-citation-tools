'use strict';

let CitationCore = require('../core/citationCore');

let args = process.argv;
if(args.length == 3) {
	let url = args[2];
	CitationCore.generate(url, (citationStr, messages) => {
		console.log(citationStr);
	});
} 
