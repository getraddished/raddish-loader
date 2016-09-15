# raddish-loader
This is the object loader of Raddish

## How does it work
The object loader is build in a few parts,
one of the is the Identifier Object.

Another is the Loader Object itself which uses Identifier objects.

The last one is an abstract locator which can be extended
injected into the Loader Object.

# Locator Object
The Locator object can be extended to try and load objects.  
When the object isn't found it will return false in the locate method,  
else it will return the object itself.  
Below an example for a locator.

```javascript
var Locator = require('raddish-loader').Locator,
    util = require('util');
    
var MyLocator() {
    Locator.call();
}

util.inherits(MyLocator, Locator);

MyLocator.prototype.locate = function(identifier) {
    ...your algorytm to find your file...
};

module.exports = MyLocator;
```

# Identifier Object
The Identifier Object is used by the loader and the locator.
This is an simplified way of noting where your file might be.

There are a few identifier notations supported at this moment:
- \<type\>://\<app\>/\<component\>.\<path (dot-separated)\>.\<file\>
- \<type\>:\<path (dot-separated)\>.\<file\>

These string can be parsed to the identifier object.

# Loader Object
This is the heart of the loader module, the following methods are supported.
Below is a list of methods and what they do:

Constructor methods
- getInstance() // This will return a single instance.

Instance methods
- setCache(true) // Sets the cache to true, an optional argument can be send to set this to false. When given a function, this method will be executed just before the object is cached.
- require(identifier, soft_fail) // Tries to locate the file, when failed, it will throw an error, unless soft_fail is true.
- setSequence(array) // Sets the fallback sequence. This must at least have one single entry in the array.
- addLocator(path) // Add a locator to the Loader
- addAlias(original, new) // Alias an identifier to another identifier.
