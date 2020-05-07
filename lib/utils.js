'use strict';
//mic-library.js
module.exports = {
    arrayRemoveDublicates,
    getConfigValuePerKey,
    cleanStringForState,
    isLikeEmpty,
    cleanArray,
};

/**
 * Remove Duplicates from Array
 * Source - https://stackoverflow.com/questions/23237704/
 * @param {array} inputArray       Array to process
 * @return {array}  Array without duplicates.
 */
function arrayRemoveDublicates(inputArray) {
    const uniqueArray = inputArray.filter(function(elem, pos) {
        return inputArray.indexOf(elem) == pos;
    });
    return uniqueArray;
}


/**
 * Retrieve values from a CONFIG variable, example:
 * const CONF = [{car: 'bmw', color: 'black', hp: '250'}, {car: 'audi', color: 'blue', hp: '190'}]
 * To get the color of the Audi, use: getConfigValuePerKey('car', 'bmw', 'color')
 * To find out which car has 190 hp, use: getConfigValuePerKey('hp', '190', 'car')
 * @param {object}  config     The configuration variable/constant
 * @param {string}  key1       Key to look for.
 * @param {string}  key1Value  The value the key should have
 * @param {string}  key2       The key which value we return
 * @returns {any}    Returns the element's value, or number -1 of nothing found.
 */
function getConfigValuePerKey (config, key1, key1Value, key2) {
    for (const lpConfDevice of config) {
        if ( lpConfDevice[key1] === key1Value ) {
            if (lpConfDevice[key2] === undefined) {
                return -1;
            } else {
                return lpConfDevice[key2];
            }
        }
    }
    return -1;
}


/**
 * Clean a given string for using in ioBroker as part of a atate
 * Will just keep letters, incl. Umlauts, numbers, "-" and "_" and "."
 * @param  {string}  strInput   Input String
 * @return {string}   the processed string 
 */
function cleanStringForState(strInput) {
    return strInput.replace(/([^a-zA-ZäöüÄÖÜß0-9\-._]+)/gi, '');
}

/**
 * Checks if Array or String is not undefined, null or empty.
 * Array or String containing just whitespaces or >'< or >"< or >[< or >]< is considered empty
 * 08-Sep-2019: added check for [ and ] to also catch arrays with empty strings.
 * @param  {any}  inputVar   Input Array or String, Number, etc.
 * @return {boolean} True if it is undefined/null/empty, false if it contains value(s)
 */
function isLikeEmpty(inputVar) {
    if (typeof inputVar !== 'undefined' && inputVar !== null) {
        let strTemp = JSON.stringify(inputVar);
        strTemp = strTemp.replace(/\s+/g, ''); // remove all whitespaces
        strTemp = strTemp.replace(/"+/g, '');  // remove all >"<
        strTemp = strTemp.replace(/'+/g, '');  // remove all >'<
        strTemp = strTemp.replace(/\[+/g, '');  // remove all >[<
        strTemp = strTemp.replace(/\]+/g, '');  // remove all >]<
        if (strTemp !== '') {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}


/**
 * Clean Array: Removes all falsy values: undefined, null, 0, false, NaN and "" (empty string)
 * Source: https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
 * @param {array} inputArray       Array to process
 * @return {array}  Cleaned array
 */
function cleanArray(inputArray) {
    const newArray = [];
    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i]) {
            newArray.push(inputArray[i]);
        }
    }
    return newArray;
}

