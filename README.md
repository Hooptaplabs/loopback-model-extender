Loopback Model Extender
=========
[![GitHub version][fury-badge]][fury-url]
[![Travis-CI][travis-badge]][travis-url]
[![Codeclimate][codeclimate-badge]][codeclimate-url]
[![Codeclimate Coverage][codeclimate-cov-badge]][codeclimate-cov-url]
[![Dependency][david-badge]][david-url]
[![DevDependency][david-dev-badge]][david-dev-url]

Loopback-model-extender is a json-centered extends library for Loopback Api Rest. It allow you specify
a list of functions that will extend your models.

**Deprecate warning**: This document it's outdated and need to be modified shortly to explain the new usage of this tool.

Short explanation
---------

This library internally makes this few steps:

1. Iterate over the models you declared on loopback (app.models)
2. For every model find on the <model>.json the root key *extends*
3. The *extends* key is expected to be something like:

        "extends" : ["buyable", "segmentable"]
4. Every key on *extends* array must represent a file inside a folder, say "server/boot/extensions" (it's an example),
so you will have two files inside this folder: 'buyable.js' and 'segmentable.js'.
5. The file 'buyable.js' must be something like:

    ```javascript
        module.exports = function (Model) {
            Model.buy = function () {};
            Model.observe('before save', function (req) {});
            /*
            And any other modification you want to made to the
            models that will extend 'buyable'
            */
        }
    ```
6. We extend every model with all the extensions.

Install
---------

You can use npm to install this package. We don't have a public npm package yet, but you can do:

    npm install https://github.com/Hooptaplabs/loopback-model-extender

Usage
---------

Once installed you need folow this steps:

1. First you need load the package on your Loopback App. Create a boot script on *server/boot* with:

    ```javascript
    var Extend = require('loopback-model-extender');
    module.exports = function (app) {
        Extend({ app: app, folder: __dirname + '/extensions'});
    }
    ```
2. Create a extensions folder. In our example we will put it on *server/boot/extensions*
3. Create a file inside called "helloworld.js" with:

    ```javascript
    module.exports = function (Model) {
            Model.helloworld = function (name) {
                return 'Hello ' + name;
            }
        }
    ```
4. Found the json of one of your models. Say you have model **Food** (for example), you will found the .json file on *common/models/Food.json*.
5. Add the key **extends** on the json with:

        "extends": ["helloworld"]
6. **Tada!** All the models whose json has the *extends* key will have the method *helloworld*.

[npm-badge]: https://img.shields.io/npm/v/loopback-model-extender.svg
[npm-url]: https://www.npmjs.com/package/loopback-model-extender

[fury-badge]: https://badge.fury.io/gh/Hooptaplabs%2Floopback-model-extender.svg
[fury-url]: https://www.npmjs.com/package/loopback-model-extender

[travis-badge]: https://travis-ci.org/Hooptaplabs/loopback-model-extender.svg
[travis-url]: https://travis-ci.org/Hooptaplabs/loopback-model-extender

[david-badge]: https://david-dm.org/Hooptaplabs/loopback-model-extender.svg
[david-url]: https://david-dm.org/Hooptaplabs/loopback-model-extender
[david-dev-badge]: https://david-dm.org/Hooptaplabs/loopback-model-extender/dev-status.svg
[david-dev-url]: https://david-dm.org/Hooptaplabs/loopback-model-extender#info=devDependencies

[gemnasium-badge]: https://gemnasium.com/badges/github.com/Hooptaplabs/loopback-model-extender.svg
[gemnasium-url]: https://gemnasium.com/github.com/Hooptaplabs/loopback-model-extender

[codeclimate-badge]: https://codeclimate.com/github/Hooptaplabs/loopback-model-extender/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/Hooptaplabs/loopback-model-extender

[codeclimate-cov-badge]: https://codeclimate.com/github/Hooptaplabs/loopback-model-extender/badges/coverage.svg?hash=1
[codeclimate-cov-url]: https://codeclimate.com/github/Hooptaplabs/loopback-model-extender/coverage

[coverage-badge]: https://codeclimate.com/github/Hooptaplabs/loopback-model-extender/badges/coverage.svg
[coverage-url]: https://codeclimate.com/github/Hooptaplabs/loopback-model-extender/coverage
