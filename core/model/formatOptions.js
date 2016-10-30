'use strict';

/**
 * @class
 * A Class for representing the format of a citation
 * @property {string} url - The URL to fetch meta data from. Default is an empty string
 * @property {Formatter} - The formatter to use when generating the citation string. Default is APA.
 */
class FormatOptions {
	constructor() {
		this.url = '';
		this.style = require('./formats/apa');
	}
}

module.exports = FormatOptions;
