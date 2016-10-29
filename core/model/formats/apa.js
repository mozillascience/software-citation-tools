'use strict';

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
 * Determines if the index is the index of the last element in the array
 * @param {number} index - The index to check
 * @param {Array} array - The array to check
 * @return {boolean} true if the index is the last element
 */
function isLastIndex(index, array) {
	return index == array.length - 1;
}

/**
 * Determines if the index is the second to last element in the array
 * @param {number} index - The index to check
 * @param {Array} array - The array to check
 * @return {boolean} true if the index is the second to last element
 */
function isSecondToLastIndex(index, array) {
	return index == array.length - 2;
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

			if(isSecondToLastIndex(index, array)) {
				returnString += ' & ';
			}
			else if(!isLastIndex(index, array)) {
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