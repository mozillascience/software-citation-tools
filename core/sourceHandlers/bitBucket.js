'use strict';

let SourceData = require('../model/sourceData');
let async = require('async');
let request = require('request');

const baseUrl = 'https://api.bitbucket.org/2.0/repositories/';
const standardUrl = 'https://bitbucket.org/'
const userAgent = 'SoftwareCitationCore';

//TODO fix the regex so that it handles "-" characters in the address
let urlRegex = /^bitbucket\.org\/(\w+)\/(\w+)/;

/**
 * Creates and sends a request for the bitBucket API.
 * @param {string} path - The path of the url.  This does not include the base path.  For example if you
 * want to send a request to 'http://api.bitBucket.com/repos/apple/swift' use 'repos/apple/swift'.
 * @param {Function} cb - The callback function. Follows the error/response parameter pattern.
 * The response param will be json parsed object.
 */
function sendApiRequest(path, cb) {
    let options = {
        url : path,
        headers: {
            'User-Agent': 'request'
        }
    }

    request(options, (error, response, body) => {
        cb(error, JSON.parse(body));
    });
}


/**
 * Creates the Repo Identifier for API queries from a repo URL.
 * @param {string} url - The URL to generate the repo identifier from
 */
function bitBucketApiRepoName(url) {
    let matches = urlRegex.exec(url);
    if(matches != null && matches.length == 3) {
        return matches[1] + '/' + matches[2];
    }
    return null;
}

/**
 * Gets 930 of the most recent commits from bitbucket
 * @param url The url of the website
 * @param obj The object that is passed through the system
 * @param recursionCount Number of times the system has looped due to pagination
 * @param cb a callback
 */
function getAllCommits(url, obj,recursionCount, cb) {
    if(!obj) obj = {};
    sendApiRequest(url, function(error, apiValReturn){
        apiValReturn.values.forEach(function(object){

            let namePieces = (object.author.user.display_name != null && typeof(object.author.user.display_name) == 'string') ? object.author.user.display_name.split(' ') : [];

            if(namePieces[1] === undefined){
                if(obj[namePieces[0] + ''] === undefined){
                    obj[namePieces[0] + ''] = 1;
                }
                else{
                    obj[namePieces[0] + ''] += 1;
                }
            }
            else{
                if (obj[namePieces[1] + ', ' + namePieces[0]] === undefined){
                    obj[namePieces[1] + ', ' + namePieces[0]] = 1;
                }
                else{
                    obj[namePieces[1] + ', ' + namePieces[0]] += 1;
                }
            }
        });
        if(apiValReturn.next !== undefined && recursionCount < 30) {
            recursionCount++;
            getAllCommits(apiValReturn.next, obj, recursionCount, cb);
        }
        else{
            cb(error, obj);
        }
    });
}


module.exports = {
    canHandle : (url) => {
        return urlRegex.exec(url) != null;
    },

    fetch : (url, callback) => {
        let repoName = bitBucketApiRepoName(url);
        if(repoName != null) {
            let sourceData = new SourceData();
            async.parallel([
                // Fetches version data on the Repo
                (cb) => {
                    sendApiRequest(baseUrl + repoName + '/versions', cb);
                },
                //Fetches the author data
                (cb) => {
                    getAllCommits(baseUrl + repoName + '/commits', {}, 0, cb);
                },
                // Fetch General data
                (cb) => {
                    sendApiRequest(baseUrl + repoName, cb);
                }
            ], (error, results) => {
                if(error == null) {
                    let sourceData = new SourceData();
                    // General info
                    let generalData = results[2];
                    sourceData.name = generalData['name'];
                    sourceData.url = standardUrl + generalData['full_name'] || generalData['html_url'];
                    sourceData.releaseDate = new Date(generalData['updated_on']);
                    sourceData.description = generalData['description'];
                    let authorList = [];
                    // Author Info
                    for (let key in results[1]) {
                        if (results[1].hasOwnProperty(key)) {
                            authorList.push({firstName: null, middleName: null, lastName: key, email: null})
                        }
                    }
                    let authors = [];
                    sourceData.authors = authorList;

                    // Version Data
                    let versions = results[0];
                    if(versions.length > 0) {
                        sourceData.version = versions[0].name || versions[1].tag_name;
                    }

                    callback(sourceData, []);
                }
                // TODO: Handle error case
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
