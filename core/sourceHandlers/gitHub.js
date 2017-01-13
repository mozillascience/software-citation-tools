'use strict';

let SourceData = require('../model/sourceData');
let async = require('async');
let request = require('request');

const baseUrl = 'https://api.github.com/';
const userAgent = 'SoftwareCitationCore';

let urlRegex = /^github\.com\/(\w+)\/(\w+)/;

/**
 * Creates and sends a request for the GitHub API.
 * @param {string} path - The path of the url.  This does not include the base path.  For example if you 
 * want to send a request to 'http://api.github.com/repos/apple/swift' use 'repos/apple/swift'.
 * @param {Function} cb - The callback function. Follows the error/response parameter pattern.
 * The response param will be json parsed object.
 */
function sendApiRequest(path, cb) {
	let options = {
		url : baseUrl + path,
		headers: {
    		'User-Agent': 'request'
  		}
	}

	request(options, (error, response, body) => {
		let parsedBody = (body != null) ? JSON.parse(body) : null;
		if(error == null && response.statusCode != 200) {
			let errorMessage = 'Received a ' + response.statusCode + ' when making a request to ' + options.url;
			cb(new Error(errorMessage, parsedBody));
		}
		else {
			cb(error, parsedBody);
		}
	});
}

/**
 * Quries the the GitHub API to get the authors of a project
 * @param {string[]} gitHubLogins - An array of GitHub username to query for information.
 * @param {Function} callback - The callback function. Follows the error response parameter pattern.
 * The response parameter is an array of Author objects
 */
function fetchAuthors(gitHubLogins, callback) {
	// Generate the requests that will feth the github user information
	let userFetchOperations = gitHubLogins.map((obj, index) => {
		return (cb) => {
			sendApiRequest('users/' + obj, (error, res) => {
				cb(error, res);
			});
		}
	});

	// Execute those requests in parallel and generate the generic user objects 
	async.parallel(userFetchOperations, (error, results) => {
		callback(error, results.map((obj) => {
			let namePieces = (obj.name != null && typeof(obj.name) == 'string') ? obj.name.split(' ') : [];
			return {
				firstName : (namePieces.length > 0) ? namePieces[0] : null,
				middleName : (namePieces.length > 2) ? namePieces[1] : null,
				lastName : (namePieces.length > 2) ? namePieces[2] : namePieces[1],
				email : obj.email
			}
		}));
	});
}

/**
 * Creates the Repo Identifier for API queries from a repo URL.
 * @param {string} url - The URL to generate the repo identifier from
 */
function gitHubApiRepoName(url) {
	let matches = urlRegex.exec(url);
	if(matches != null && matches.length == 3) {
		return matches[1] + '/' + matches[2];
	}

	return null;
}

module.exports = {
	canHandle : (url) => { 
		return urlRegex.exec(url) != null;
	},

	fetch : (url, callback) => {
		let repoName = gitHubApiRepoName(url);
		if(repoName != null) {
			let sourceData = new SourceData();
			async.parallel([
				// Fetches general info on the Repo
				(cb) => {
					sendApiRequest('repos/' + repoName, cb);	
				},
				//Fetches the author data
				(cb) => {
					sendApiRequest('repos/' + repoName + '/contributors', (error, users) => {
						if(error == null) {
							let userLogins = users.map((obj) => {
								return obj.login;
							}).filter((obj, index) => {
								return index < 3;
							});

							fetchAuthors(userLogins, cb);
						}
						else {
							cb(error, users);
						}
					});
				},
				// Fetch Version data
				(cb) => {
					sendApiRequest('repos/' + repoName + '/releases', cb);
				}
			], (error, results) => {
				if(error == null) {
					let sourceData = new SourceData();

					// General info
					let generalData = results[0];
					sourceData.name = generalData['name'];
					sourceData.url = generalData['homepage'] || generalData['html_url'];
					sourceData.releaseDate = new Date(generalData['updated_at']);
					sourceData.description = generalData['description'];

					// Author Info
					sourceData.authors = results[1];

					// Version Data
					let versions = results[2];
					if(versions.length > 0) {
						sourceData.version = versions[0].name || versions[1].tag_name;
					}

					callback(sourceData, []);
				}
				else {
					callback(null, [error]);
				}
			});
		}

		// var sourceData = new SourceData();
		// sourceData.name = 'Project Name';
		// sourceData.authors = [
		// 	{firstName :'Eric', lastName : 'Lee', email :'abc@rit.edu'},
		// 	{firstName :'Colin', lastName : 'O\'Neill', email :'def@rit.edu'}
		// ];
		// sourceData.version = '1.0';
		// sourceData.releaseDate = new Date();
		// sourceData.url = url;
		// sourceData.licence = 'MIT';
		// sourceData.description = 'This is a test project';
		// sourceData.uid = null;
		// console.log(sourceData);

		// var messages = []
		// callback(sourceData, messages)
	}
};
