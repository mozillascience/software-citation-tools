function authorName(author, index) {
	if(author.firstName != null && author.lastName != null) {
		return (index == 0) ? (author.lastName + ', ' + author.firstName) : author.firstName + ' ' + author.lastName;
	}
	return author.lastName || author.firstName;
}

module.exports = {
	format : (sourceData) => {
		let returnString = '';
		// Authors
		sourceData.authors.forEach((author, index, array) => {
			returnString += authorName(author, index);

			if(index == array.length - 2) {
				returnString += ' and ';
			}
			else if(index == array.length - 1) {
				returnString += '.';
			}
			else {
				returnString += ', ';
			}
		});

		// Title
		if(sourceData.name != null) {
			returnString += ' "' + sourceData.name + '".'
		}

		// Publication information (Year, version)
		let pubInfo = [];
		if(sourceData.releaseDate != null) {pubInfo.push(sourceData.releaseDate.getFullYear());}
		if(sourceData.version != null) {pubInfo.push(sourceData.version);}

		if(pubInfo.length > 0) {
			returnString += '(';
			pubInfo.forEach((obj, index, array) => {
				returnString += obj;
				if(index != (array.length - 1)) {
					returnString += ', ';
				}
			});
			returnString += '). ';
		}

		// URL
		if(sourceData.url != null) {
			returnString += sourceData.url;
		}

		return returnString;
	}
}