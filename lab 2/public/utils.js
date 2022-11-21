const md5 = require('blueimp-md5');
const apiKeys = require('../config/apiKeys');
const baseUrl = 'https://gateway.marvel.com:443/v1/public';

module.exports = {
  generateUrl(res) {
    res = this.checkString(res, 'resource');
    const publickey = apiKeys.marvelKeys.publicKey;
    const privatekey = apiKeys.marvelKeys.privateKey;
    const ts = new Date().getTime();
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const url = `${baseUrl}/${res}?ts=${ts}&apikey=${publickey}&hash=${hash}`;
    return url;
  },

  checkString(str, varName) {
    if (!str) throw `Error: You must supply a ${varName}!`;
    if (typeof str !== 'string') throw `Error: ${varName} must be a string!`;
    str = str.trim();
    if (str.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    // if (!isNaN(str))
    //   throw `Error: ${str} is not a valid value for ${varName} as it only contains digits`;
    return str;
  },
};
