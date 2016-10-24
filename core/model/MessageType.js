/**
 * Enum representing the types of messages
 * @readonly
 * @enum {number}
 */
module.exports = {
	warning : 1,
	error : 2,
	
	stringVal : function(messageType) {
		switch(messageType) {
			case 1:
				return 'Warning';
			case 2:
				return 'Error';
			default:
				return 'Unknown';
		}
	}
}