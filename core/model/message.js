let MessageType = require('messageType')

/**
 * A class to represent the data for a note the system wants to convey to the user
 * @class
 * @prop {number} type - The value that should map to a MessageType enum.
 * @prop {string} message - A human readable string of the conents of the message
 */
class Message {
	/**
	 * @constructs Message
	 * @param {number} - An value corrisponding to the MessageType Enum
	 * @param {string} - The body of the message
	 */
	constructor(type, message) {
		this.type = type;
		this.message = message;
	}

	toString() {
		return MessageType.stringVal(this.type) + ': ' + this.message;
	}
}

module.exports = Message;