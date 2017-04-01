var Locator = require('../index').Locator,
    Identifier = require('../index').Identifier,
    Loader = require('../index').Loader.getInstance();

require('should');

describe('Locator tests', function() {
    it('Should have the basic methods', function() {
        Locator.prototype.locate.should.be.a.Function;
    });

    it('Should throw an error when locate ins\'t overwritten', function() {
        try {
            Locator.prototype.locate();
        } catch(err) {
            err.message.should.equal('This function is to be overridden');
        }
    });

    it('Should correctly add a locator', function() {
        Loader.addLocator(__dirname + '/locator/custom');
    });

    it('Should correctly return an located object', function() {
        var identifier = new Identifier('custom://test/package.path.test'),
            item = Loader.locators.custom.locate(identifier);

        item.should.be.a.Function;
        item.prototype.testMethod.should.be.a.Function;
    });
});
