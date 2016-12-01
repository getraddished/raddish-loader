'use strict';

var Inflector   = require('raddish-inflector');

/**
 * ObjectIdentifier object which helps with the location of files and building identifiers
 *
 * @class ObjectIdentifier
 * @param {String} identifier Identifier to convert to an object.
 * @constructor
 */
class ObjectIdentifier {
    constructor(identifier) {
        identifier = identifier.toString();

        if(identifier.indexOf(':') === -1) {
            throw new TypeError('Malformed identifier');
        }

        var parts = identifier.split(':');

        this._type = parts[0];
        this._path = [];
        this._application = '';
        this._package = '';
        this._name = '';

        parts = parts[1].replace('//', '').split('/');

        if(parts.length === 1) {
            this._application    = '';
            this._path           = parts[0].replace('/', '').split('.');
        } else {
            this._application    = parts[0];
            this._path           = parts[1].replace('/', '').split('.');
        }

        this._package   = this._path.shift();
        this._name      = Inflector.singularize(this._path.pop());
    }

    /**
     * Return a new instance of the current identifier.
     *
     * @method clone
     * @returns {ObjectIdentifier} A cloned identifier.
     */
    clone() {
        return new ObjectIdentifier(this.toString());
    }

    /**
     * Recreate the identifier given to the Object.
     *
     * @method toString
     * @returns {string} The recreated identifier string given to the current object.
     */
    toString() {
        var string = [];

        if(this._type) {
            string.push(this._type + (this._application ? '://' : ':'));
        }

        if(this._application) {
            string.push(this._application + '/');
        }

        if(this._package) {
            string.push(this._package + '.');
        }

        if(this._path) {
            string.push(this._path.join('.') + '.');
        }

        if(this._name) {
            string.push(this._name);
        }

        return string.join('');
    }

    /**
     * Return the current type
     *
     * @method getType
     * @returns {String} Type of the current identifier.
     */
    getType() {
        return this._type;
    }

    /**
     * Return the current application
     *
     * @method getApplication
     * @returns {String} Application name of the current identifier.
     */
    getApplication() {
        return this._application;
    }

    /**
     * Return the current component
     *
     * @method getComponent
     * @returns {String} Component name of the current identifier.
     */
    getPackage() {
        return this._package;
    }

    /**
     * Return the current path
     *
     * @method getPath
     * @returns {Array} path of the current identifier.
     */
    getPath() {
        return this._path;
    }

    /**
     * Return the current name
     *
     * @method getName
     * @returns {String} Name of the current identifier.
     */
    getName() {
        return this._name;
    }

    /**
     * Set the type of the current identifier
     *
     * @method setApplication
     * @param {String} type The type for the current identifier.
     */
    setType(type) {
        this._type = type;

        return this;
    }

    /**
     * Set the application of the current identifier
     *
     * @method setApplication
     * @param {String} application The application name for the current identifier.
     */
    setApplication(application) {
        this._application = application;

        return this;
    }

    /**
     * Set the component of the current identifier
     *
     * @method setComponent
     * @param {String} package The package name for the current identifier.
     */
    setPackage(pack) {
        this._package = pack;

        return this;
    }

    /**
     * Set the path of the current identifier
     *
     * @method setPath
     * @param {Array} path The path for the current identifier.
     */
    setPath(path) {
        this._path = path;

        return this;
    }

    /**
     * Set the name for the current identifier
     *
     * @method setName
     * @param {String} name The name for the current identifier.
     */
    setName(name) {
        this._name = name;

        return this;
    }
}

module.exports = ObjectIdentifier;