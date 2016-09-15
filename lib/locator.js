/**
 * An abstract locator class, this class is to be used to add a locator.
 * In the locator the type has to be defined. and is used in the identifier like <_type>://
 *
 * @class Locator
 * @constructor
 */
function Locator(type) {
    this._type = type || '';
}

Locator.prototype.locate = function(identifier) {
    throw new Error('This function is to be overridden');
};

module.exports = Locator;