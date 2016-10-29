let FormatOptions = require('../core/model/formatOptions');

/**
 * @module
 * A Module for parsing the given command line arguments.
 */
module.exports = {
	/**
	 * The function that parses an array of arguments
	 * @param {Array<string>} args - An array of the strings that represent the arguments. 
	 * @returns {FormatOptions} - The format options object with the properties set depending upon the given arguments
	 * @throws {Error} - May throw an error message if the given arguments are not well formed. Spesific descriptions of the
	 * errors will be in the message property of the message.
	 */
	parse : (args) => {
		if(args.length >= 1) {
			let formatOptions = new FormatOptions();
			formatOptions.url = args[0];
			for(let i = 1; i < args.length; i++) {
				let optionHandler = optionFlags[args[i]];
				if(optionHandler != null) {
					i = optionHandler(i, args, formatOptions);
				}
				else {
					throw new Error(args[i] + ' is an unsupported argument.');
				}
			}

			return formatOptions;
		}
		else {
			throw new Error('You must provide at least a URL.');
		}
	}
}

/**
 * Gets the next value in the array.
 * @param {number} index - The current index
 * @param {Array} array - The array to get the next value.
 * @return {Object} - The next value in the array or null if it does not exist.
 */
function getNextValue(index, array) {
	let nextIndex = index + 1;
	if(nextIndex < array.length) {
		return array[nextIndex];
	}

	return null;
}

/**
 * Determines the Formatter object from a string.
 * @param {string} formatString - The string representation of a format. For example c or 'chicago' will return the Chicago Formatter.
 * @return {Formatter} - The formatter for the given description.
 * @throws {Error} Will throw an error if a formatter is not found
 */
function getFormat(formatString) {
	let format = formatString.toLowerCase();
	if(format == 'apa' || format == 'a') {
		return require('../core/model/formats/apa');
	}
	else if(format == 'chicago' || format == 'c') {
		return require('../core/model/formats/chicago');
	}

	throw new Error(formatString + ' is an unsuported citation format. Try apa or chicago');
}

/**
 * Parses the format flag.
 * @param The index
 */
function parseFormat(index, args, formatOptions) {
	let nextValue = getNextValue(index, args);
	if(nextValue != null) {
		formatOptions.style = getFormat(nextValue);
		return index + 2;
	}
	
	throw new Error('No format provided');
}

/**
 * Option flags.  The string representation of a flag maps to the function that parses that flag.
 * A parse function must have the parameters:
 * - the index that the flag occured.
 * - the array of the args
 * - the format option object that it must modify based on the value of the flag.
 * The function must return the index after the last argument it has consumed.  This index does not need to be in bounds, but it should
 * me greater than the index passed in.
 */
let optionFlags = {
	'-f' : parseFormat
}