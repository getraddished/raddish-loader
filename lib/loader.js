"use strict";

var ObjectIdentifier    = require('./identifier'),
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

    if(this.getCache(identifier.toString())) {
        return this.getCache(identifier.toString());
    }

    var original_identifier = identifier.clone(),
        object = this._resolve(identifier);

    if(!object && soft_fail !== true) {
        throw new Error('Identifier "' + identifier.toString() + '" is not a correct resource identifier');
    } else if(!object && soft_fail === true) {
        return false;
    }

    this.addCache(identifier.toString(), object);
    return object;
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
 * @returns {ObjectLoader} The current instance of the ObjectLoader.
 */
ObjectLoader.prototype.setCaching = function(cache_param) {
    this.allow_cache = cache_param || true;

    return this;
};

/**
 * Add a single cache item to the cache.
 *
 * @param {String} identifier The identifier to cache.
 * @param {*} object The object to place in the cache.
 * @returns {ObjectLoader} The current instance of the ObjectLoader.
 */
ObjectLoader.prototype.addCache = function(identifier, object) {
    this.cache[identifier] = object;

    return this;
};

/**
 * This method returns an item from the cache.
 * When the item isn't found in the cache it will return a false.
 *
 * @param {String} identifier The identifier of the object to receive.
 * @returns {*} The found value of the identifier or false when it doesn't exist.
 */
ObjectLoader.prototype.getCache = function(identifier) {
    var obj = this.cache[identifier]
    if(!obj) {
        return false;
    }

    return obj;
};

/**
 * This method removes a single item from the cache,
 * when the item isn't found nothing is done.
 *
 * @param {String} identifier The identifier to remove from the cache.
 * @returns {ObjectManager} The current instance of the ObjectLoader.
 */
ObjectLoader.prototype.removeCache = function(identifier) {
    if(this.cache[identifier]) {
        this.cache[identifier] = null;
    }

    return this;
};

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
    for(var index in this.sequence) {
        var ident = this._parseSequence(this.sequence[index], identifier);

        var object = this._receive(ident);
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
    return this.locators[identifier.getType()].locate(identifier);
};

/**
 * This method will return a single instance.
 * This is done so we know that the object (and cache) will only be initialized once.
 *
 * @returns {ObjectLoader} A single ObjectLoader instance.
 */
ObjectLoader.getInstance = function() {
    if(instance === null) {
        instance = new ObjectLoader();
    }

    return instance;
};

module.exports = ObjectLoader;
