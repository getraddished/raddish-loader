'use strict';

var Loader = require('../index'),
    identifier = new Loader.Identifier('type://application/package.path.name'),
    core = new Loader.Identifier('core:database.table.default');

require('should');

describe('Identifier tests', function() {
    describe('Initialization', function() {
        it('Should throw an error when an incorrect identifier is initialized', function() {
            try {
                new Loader.Identifier('incorrect.identifier');
            } catch(error) {
                error.message.should.equal('Malformed identifier');
            }
        });

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

            it('Should return a correct clone', function() {
                identifier.clone().toString().should.equal('type://application/package.path.name');
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

            it('Should return a correct clone', function() {
                core.clone().toString().should.equal('core:database.table.default');
            });
        });

        describe('Setting of identifier values', function() {
            it('Should set a new type', function() {
                identifier.setType('test');

                // Check internal type variable.
                identifier._type.should.equal('test');
            });

            it('Should set a new application', function() {
                identifier.setApplication('testapp');

                // Check internal application variable.
                identifier._application.should.equal('testapp');
            });

            it('Should set a new package', function() {
                identifier.setPackage('testpackage');

                // Check internal package variable.
                identifier._package.should.equal('testpackage');
            });

            it('Should set a new path', function() {
                identifier.setPath(['new', 'path']);

                // Check internal path variable.
                identifier._path.should.containDeepOrdered(['new', 'path']);
            });

            it('Should set a new name', function() {
                identifier.setName('testname');

                // Check internal name variable.
                identifier._name.should.equal('testname');
            });
        });
    });
});