'use strict';

let UrlResolver = require('./urlResolver');
let ApaFormat = require('./model/formats/apa');

/**
 * @module CitationCore
 * Module for generating citations from Code Source URL's like GitHub, or FigShare.
 */
module.exports = {
	/**
	 * @param {FormatOptions} formatOptions - The basic configuration object that is used to determine the format of the citation output string
	 * @param {CitationCore~fetch} callback - Callback on completion of citation generation. Args are string and array of errors or warning  
	 */
	generate : (formatOptions, callback) => {
		// Strip http:// and www. if they exists
		let sanitizedUrl = formatOptions.url.replace(/^http(s)?\:\/\//, '').replace(/^www\./, '');
		let urlHandler = UrlResolver.getHandler(sanitizedUrl);
		if(urlHandler != null) {
			urlHandler.fetch(sanitizedUrl, (sourceData, messages) => {
				if(sourceData != null) {
					var citation = formatOptions.style.format(sourceData);
				}

				callback(citation, messages);
			})
		}
		else {
			callback(null, [new Error('"' + formatOptions.url + '" is an unsupported source')]);
		}
	}
}

/**
 * The callback for the CitationCore generate function
 * @callback CitationCore~generate
 * @param {string} The Formatted citation
 * @param {Array<Messages>}
 */
 