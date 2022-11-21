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

  checkString(str) {
    if (!str) throw `Error: You must supply a id!`;
    if (typeof str !== 'string') throw `Error: id must be a string!`;
    str = str.trim();
    if (str.length === 0)
      throw `Error: id cannot be an empty string or string with just spaces`;
    return str;
  },

  checkPage(page) {
    if (!page) throw `Error: You must supply a page!`;
    if (page.length === 0)
      throw `Error: page cannot be an empty number or number with just spaces`;
    page = parseInt(page);
    if (Number.isNaN(page)) throw `Error: page must be a number!`;
    return page;
  },
};
