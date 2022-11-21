const { ObjectId } = require('mongodb');
const moodList = require('./moodList').moodList;

module.exports = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(str, varName) {
    if (!str) throw `Error: You must supply a ${varName}!`;
    if (typeof str !== 'string') throw `Error: ${varName} must be a string!`;
    str = str.trim();
    if (str.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(str))
      throw `Error: ${str} is not a valid value for ${varName} as it only contains digits`;
    return str;
  },

  checkMood(sweetMood) {
    let e = moodList.includes(sweetMood);
    if (!e) throw 'invalid sweetMood!';
    else return sweetMood;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    let arrayInvalidFlag = false;
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        arrayInvalidFlag = true;
        break;
      }
      arr[i] = arr[i].trim();
    }
    if (arrayInvalidFlag)
      throw `One or more elements in ${varName} array is not a string or is an empty string`;
    return arr;
  },
};
