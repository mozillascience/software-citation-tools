/**
 * Gets the next value in the array.
 * @param {number} index - The current index
 * @param {Array} array - The array to get the next value.
 * @return {Object} - The next value in the array or null if it does not exist.
 */
Array.prototype.getNextValue = function(index) {
	let nextIndex = index + 1;
	if(nextIndex < this.length) {
		return this[nextIndex];
	}

	return null;
}

/**
 * Determines if the index is the index of the last element in the array
 * @param {number} index - The index to check
 * @param {Array} array - The array to check
 * @return {boolean} true if the index is the last element
 */
Array.prototype.isLastIndex = function(index) {
	return index == (this.length - 1);
}

/**
 * Determines if the given index is n elements from end of the array.
 * @param {number} index - The index to test from the end 
 * @param {number} n - the number of positions from the end.
 * @return {boolean} - True if index is n positions from the end of the array.
 */
Array.prototype.isNFromLastIndex = function(index, n) {
	return (this.length - 1 - n) == index;
}