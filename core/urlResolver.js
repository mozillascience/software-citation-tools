'use strict';

let GitHubSourceHandler = require('./sourceHandlers/gitHub');

let handlers = [GitHubSourceHandler];

module.exports = {
	/**
	 * Gets the generator for the given url
	 * @param {string} the url to pattern match to the generator
	 * @return {Generator} the generator object for the URL or null
	 */
	getHandler : (url) => {
		// See if we can match a generator
		for(let handler of handlers) {
			if(handler.canHandle(url)) {
				return handler;
			}
		}

		return null;
	}
}
