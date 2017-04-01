var Loader = require('../index').Loader,
    Instance = Loader.getInstance();

require('should');

describe('Loader tests', function() {
    describe('Check initial values', function() {
        it('Should have all the basic methods defined', function() {
            Loader.getInstance.should.be.a.Function;
            Instance.setSequence.should.be.a.Function;
            Instance.require.should.be.a.Function;
            Instance.setCaching.should.be.a.Function;
            Instance.addCache.should.be.a.Function;
            Instance.getCache.should.be.a.Function;
            Instance.removeCache.should.be.a.Function;
            Instance.addLocator.should.be.a.Function;
            Instance._resolve.should.be.a.Function;
            Instance._parseSequence.should.be.a.Function;
            Instance._receive.should.be.a.Function;
        });
    });

    describe('Function tests', function() {
        describe('setSequence tests', function() {
            it('Should throw an error when an object is used as sequence', function() {
                try {
                    Instance.setSequence({
                        0: '<Type>'
                    });
                } catch(err) {
                    err.message.should.equal('The loader sequence is to be an array! (object given)');
                }
            });

            it('Should throw an error when a string is used as sequence', function() {
                try {
                    Instance.setSequence('<Type>');
                } catch(err) {
                    err.message.should.equal('The loader sequence is to be an array! (string given)');
                }
            });

            it('Should throw an error when the sequence has an incorrect length', function() {
                try {
                    Instance.setSequence([]);
                } catch(err) {
                    err.message.should.equal('The sequence needs to have at least on entry!');
                }
            });

            it('Should correctly set an sequence', function() {
                Instance.setSequence([
                    '<Type>://<Application>/<Package>.<Path>.<Name>'
                ]);

                Instance.sequence.length.should.equal(1);
                Instance.sequence.should.containEql('<Type>://<Application>/<Package>.<Path>.<Name>');
            });
        });

        it('Should set a value in the cache', function() {
            Instance.addCache('test', {hello: 'world'});
            Instance.cache.test.hello.should.equal('world');
        });

        it('Should return the cached value', function() {
            Instance.getCache('test').hello.should.equal('world');
        });

        it('Should return false when cache is missed', function() {
            Instance.getCache('test2').should.be.false();
        });

        it('Should remove a cache variable', function() {
            Instance.removeCache('test');
            Instance.getCache('test').should.be.false();
        });

        it('Should correctly switch caching', function() {
            Instance.setCaching().allow_cache.should.be.true();
            Instance.setCaching(true).allow_cache.should.be.true();
            Instance.setCaching(false).allow_cache.should.be.false();
        });

        it('Should correctly return an object', function() {
            // Set the sequence for test purposes.
            Instance.setSequence([
                '<Type>://<Application>/<Package>.<Path>.<Name>'
            ]);
            Instance.addLocator(__dirname + '/locator/custom');

            Instance.require('custom://test/test.test.test').should.be.an.Object;

            // Second call is from the cache.
            Instance.require('custom://test/test.test.test').should.be.an.Object;
        });

        it('Should return an error when softfail isn\'t set to true', function() {
            Instance.setSequence([
                '<Type>://<Application>/<Package>.<Path>.<Name>'
            ]);
            Instance.addLocator(__dirname + '/locator/custom');

            try {
                Instance.require('custom://test/test.test.test2').should.be.an.Object;
            } catch(err) {
                err.message.should.equal('Identifier "custom://test/test.test.test2" is not a correct resource identifier')
            }

            Instance.require('custom://test/test.test.test2', true).should.be.false();
        });

        it('Should correctly parse the sequence', function() {
            var identifier = Instance._parseSequence('<Type>://<Application>/<Package>.<Path>.<Name>', 'custom://test/test.test.test2');
            identifier.getName().should.equal('test2');
        });
    });
});