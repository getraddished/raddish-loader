'use strict';

var Locator = require('../../index').Locator;

class CustomLocator extends Locator {
    constructor() {
        super('custom');
    }

    locate(identifier) {
        try {
            return require(__dirname + '/../item/' + identifier.getName());
        } catch(err) {
            return false;
        }
    }
}

module.exports = CustomLocator;