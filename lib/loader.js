"use strict";

var ObjectIdentifier    = require('./identifier'),
    clone               = require('clone'),
    instance            = null;

/**
 * ObjectLoader object which handles all the loading of the requested objects.
 *
 * @class ObjectLoader
 * @constructor
 */
function ObjectLoader() {
    this.allow_cache = false;
    this.cache = {};
    this.sequence = [];
    this.locators = {};
    this.aliases = {};
}

/**
 * Method to set the internal sequence for the loader script.
 *
 * @param {Array} seq An array with sequences to load.
 * @returns {ObjectLoader} The current object for chaining.
 */
ObjectLoader.prototype.setSequence = function(seq) {
    if(Array.isArray(seq) && seq.length > 0) {
        this.sequence = seq;
    } else if(!Array.isArray(seq)) {
        throw new TypeError('The loader sequence is to be an array! (' + (typeof seq) + ' given)');
    } else if(seq.length <= 0) {
        throw new Error('The sequence needs to have at least on entry!');
    } else {
        throw new Error('Undefined Error!');
    }

    return this;
};

/**
 * This method will act like the require method, but instead of a path it accepts an identifier.
 *
 * @param {String|ObjectIdentifier} identifier The identifier of the required object
 * @returns {Object} Returns the uninstanciated object.
 */
ObjectLoader.prototype.require = function (identifier, soft_fail) {
    if(typeof identifier === 'string') {
        identifier = new ObjectIdentifier(identifier);
    }

    var object = this.prototype.resolve(identifier);
    if(!object && soft_fail !== true) {
        throw new Error('Identifier "' + identifier.toString() + '" is not a correct resource identifier');
    }

    // TBD
};

/**
 * Using this method you can set the cache.
 * If no argument is given then the cache will be enabled,
 * otherwise you can send a method, then the cache will be enabled, and before the object
 * is cached, this method is called.
 *
 * When false is given, the cache is also disabled.
 *
 * @param {Boolean/ function} cache_param The boolean for the cache, or a pre-cache function.
 */
ObjectLoader.prototype.setCache = function(cache_param) {
    if(cache_param === undefined) {
        this.allow_cache = true;
    } else {
        this.allow_cache = cache_param;
    }

    return this;
};

// ObjectLoader.prototype.registerAlias = function(original, target) {
//     aliases[alias] = new ObjectIdentifier(identifier);
//
//     return this;
// };

/**
 * Add a locator for a specific type.
 *
 * @param {String} path The path to the locator.
 */
ObjectLoader.prototype.addLocator = function (path) {
    var locator = new (require(path))();

    if(!this.locators[locator._type]) {
        this.locators[locator._type] = locator;
    }
};

/**
 * Load a specific object.
 * By default it will be checking in the applications folder.
 *
 * @private
 * @method resolve
 * @param {String} identifier The identifier of the object which needs to be resolved.
 */
ObjectLoader.prototype._resolve = function (identifier) {
    var sequence = this.getSequence();

    for(var index in sequence) {
        var ident = this.parseSequence(sequence[index], identifier);

        var object = this.receive(ident);
        if(object !== false) {
            return object;
        }
    }

    return false;
};

/**
 * Parse the sequence identifier
 * This will result in a usable identifier
 *
 * @private
 * @method parseSequence
 * @param {Sring} string The sequence string to parse
 * @param identifier
 * @returns {ObjectIdentifier}
 */
ObjectLoader.prototype._parseSequence = function(string, identifier) {
    if(!(identifier instanceof ObjectIdentifier)) {
        identifier = new ObjectIdentifier(identifier);
    }

    string = string.replace('<Type>', identifier.getType());
    string = string.replace('<App>', identifier.getApplication());
    string = string.replace('<Package>', identifier.getPackage());
    string = string.replace('<Path>', identifier.getPath().join('.'));
    string = string.replace('<Name>', identifier.getName());

    return new ObjectIdentifier(string);
};

/**
 * Receive method will triy to return the requested file.
 *
 * @private
 * @method receive
 * @param {String} identifier The identifier of the object to load.
 * @returns {Object|false} Result of the call when the file isn't found it will return false.
 */
ObjectLoader.prototype._receive = function (identifier) {
    return locators[identifier.getType()].locate(identifier);
};

/**
 * The load method will check if the object has been cached.
 * If this is not the case it will try to resolve the object.
 *
 * When an object has been loaded for the first time it is cached for reuse in a later request.
 *
 * @method load
 * @param {String} identifier The identifier of the object to be loaded.
 * @param {Object} config This is the config object to send loaded object.
 * @return {Promise} This will hold the uninitialized object.
 */
ObjectLoader.load = function (identifier, config) {
    function getConfigIdentifier(config) {
        var keys = [];
        var identifier = {};

        for(var index in config) {
            if(config.hasOwnProperty(index)) {
                keys.push(index);
            }
        }

        for(var index in keys) {
            var key = keys[index];

            if(config[key] && config.hasOwnProperty(key)) {
                identifier[key] = config[key];
            }
        }

        return JSON.stringify(identifier);
    }

    if(aliases[identifier]) {
        identifier = aliases[identifier];
    } else {
        identifier = new ObjectIdentifier(identifier);
    }

    var self = this;
    var orgIdentifier = identifier.clone();
    var configIdentifier = getConfigIdentifier(config);

    if (cache[[orgIdentifier.toString(), configIdentifier].join('_')]) {
        var obj = cache[[orgIdentifier.toString(), configIdentifier].join('_')];

        return clone(obj);
    } else {
        var Object = self.prototype.resolve(identifier);
        if(Object === false) {
            throw new Error();
        }

        if(object.cache !== false && Raddish.getConfig('cache')) {
            cache[[orgIdentifier.toString(), configIdentifier].join('_')] = Object;
        }

        return clone(Object);
    }
};



ObjectLoader.getInstance = function() {
    if(instance === null) {
        instance = new ObjectLoader();
    }

    return instance;
};

module.exports = ObjectLoader;
