'use strict';

let UrlResolver = require('./urlResolver');
let ApaFormat = require('./model/formats/apa');

/**
 * @module CitationCore
 * Module for generating citations from Code Source URL's like GitHub, or FigShare.
 */
module.exports = {
	/**
	 * @param {string} url - the url of the code source to generate citation from
	 * @param {CitationCore~fetch} callback - Callback on completion of citation generation. Args are string and array of errors or warning  
	 */
	generate : (url, callback) => {
		// Strip http:// and www. if they exists
		let sanitizedUrl = url.replace(/^http(s)?\:\/\//, '').replace(/^www\./, '');
		let urlHandler = UrlResolver.getHandler(sanitizedUrl);
		if(urlHandler != null) {
			urlHandler.fetch(sanitizedUrl, (sourceData, messages) => {
				let citation = ApaFormat.format(sourceData);
				callback(citation, [])
			})
		}
		else {
			// TODO: Populate array with error
			callback(null, [])
		}
	}
}

/**
 * The callback for the CitationCore generate function
 * @callback CitationCore~generate
 * @param {string} The Formatted citation
 * @param {Array<Messages>}
 */