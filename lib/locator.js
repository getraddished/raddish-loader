'use strict';

/**
 * An abstract locator class, this class is to be used to add a locator.
 * In the locator the type has to be defined. and is used in the identifier like <_type>://
 *
 * @class Locator
 * @constructor
 */
class Locator {
    constructor(type) {
        this._type = type || '';
    }

    locate(identifier) {
        throw new Error('This function is to be overridden');
    }
}

module.exports = Locator;