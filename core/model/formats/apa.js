'use strict';
require('../../../utils/array');

/**
 * Generates the string that represents the author's name in APA
 * @param {Author} author - The Author to generate the name string from
 * @return An APA representation of the authors name.  Will be null if a name cannot be generated.
 */
function getAuthorName(author) {
	// If the author has a name
	if(author.lastName != null || author.firstName != null) {
		// If we have the authors first and last name
		if(author.lastName && author.firstName) {
			 return author.lastName + ', ' + author.firstName[0] + '.';
		}
		// If we just have the authors first or last name
		else {
			return (author.lastName != null) ? author.lastName : author.firstName;
		}
	}

	return null;
}

/**
 * @module APA Formatter
 * Module for formatting source data into a APA citation string
 */
module.exports = {
	/**
	 * Formats a source data object to a citation
	 * @param {SourceData} sourceData - The SourceData object to generate the citation string from
	 * @return {string} - The citation in APA format
	 */
	format : (sourceData) => {
		let returnString = '';
		
		// Authors
		let numAuthors = sourceData.authors.length;
		sourceData.authors.forEach((author, index, array) => {
			let authorName = getAuthorName(author);
			returnString += (authorName != null) ? authorName : '';

			if(array.isNFromLastIndex(index, 1)) {
				returnString += ' & ';
			}
			else if(!array.isLastIndex(index)) {
				returnString += ', ';
			}
		});

		// Year
		if(sourceData.releaseDate != null) {
			returnString += ' (' + sourceData.releaseDate.getFullYear() + ').';
		}

		// Title
		if(sourceData.name != null) {
			returnString += ' "' + sourceData.name + '".';
		} 

		// Version
		if(sourceData.version != null) {
			returnString += ' Version: ' + sourceData.version + '.';
		}

		// URL
		if(sourceData.url != null) {
			returnString += ' Retrieved From: ' + sourceData.url; 
		}

		return returnString;
	}
}
