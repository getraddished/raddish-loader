var Loader = require('../index'),
    identifier = new Loader.Identifier('type://application/package.path.name'),
    core = new Loader.Identifier('core:database.table.default');

require('should');

describe('Initialization', function() {
    describe('Normal identifier', function() {
        it('Should return a correct identifier object from string', function() {
            identifier.should.be.instanceOf(Loader.Identifier);
            identifier.toString.should.be.a.function;
            identifier.getPath.should.be.a.function;
            identifier.clone.should.be.a.function;
        });
    });

    describe('Core identifier', function() {
        it('Should return a correct identifier object from string', function() {
            core.should.be.instanceOf(Loader.Identifier);
            core.toString.should.be.a.function;
            core.getPath.should.be.a.function;
            core.clone.should.be.a.function;
        });
    });
});

describe('Basic values', function() {
    describe('Normal identifier', function() {
        it('Should have a correct path', function() {
            identifier.getPath().should.be.an.Array;
        });

        it('Should have a correct application', function() {
            identifier.getApplication().should.equal('application');
        });

        it('Should have a correct name', function() {
            identifier.getName().should.equal('name');
        });

        it('Should have a correct package', function() {
            identifier.getPackage().should.equal('package');
        });

        it('Should have a correct type', function() {
            identifier.getType().should.equal('type');
        });

        it('Should return a correct toString value', function() {
            identifier.toString().should.equal('type://application/package.path.name');
        });
    });

    describe('Core identifier', function() {
        it('Should have a correct path', function() {
            core.getPath().should.be.an.Array;
        });

        it('Should have a correct application', function() {
            core.getApplication().should.equal('');
        });

        it('Should have a correct name', function() {
            core.getName().should.equal('default');
        });

        it('Should have a correct package', function() {
            core.getPackage().should.equal('database');
        });

        it('Should have a correct type', function() {
            core.getType().should.equal('core');
        });

        it('Should return a correct toString value', function() {
            core.toString().should.equal('core:database.table.default');
        });
    });
});