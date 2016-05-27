Loopback Model Extender
=========

Loopback-model-extender is a json-centered extends library for Loopback Api Rest. It allow you specify
a list of functions that will extend your models.

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

        Model.buy = function () {

        };

        Model.observe('before save', function (req) {

        });


        /* And any other modification you want to made to the models that will extend 'buyable' */

    }

```
6. We extend every model with all the extensions.

Install
---------

In order to use this package you only need to install it. We don't have a public npm package yet, but you can do:

    npm install https://github.com/Hooptaplabs/loopback-model-extender

Usage
---------

Once installed you need folow this steps:

### **Step 1:** Create a extensions folder

This library works


Once installed you can add this code to any script on /server/boot like this:

```javascript
    module.exports = function extendBootFunction (app) {

        Extender({ app: app, folder: __dirname + '/extensions'});

    }
```



[![GitHub version](https://badge.fury.io/gh/Hooptaplabs%2Floopback-model-extender.svg)](https://badge.fury.io/gh/Hooptaplabs%2Floopback-model-extender)
[![Travis-CI](https://travis-ci.org/Hooptaplabs/loopback-model-extender.svg)](https://travis-ci.org/Hooptaplabs/loopback-model-extender)
[![codecov](https://codecov.io/gh/Hooptaplabs/loopback-model-extender/branch/master/graph/badge.svg)](https://codecov.io/gh/Hooptaplabs/loopback-model-extender)
[![Coverage Status](https://coveralls.io/repos/github/Hooptaplabs/loopback-model-extender/badge.svg?branch=develop)](https://coveralls.io/github/Hooptaplabs/loopback-model-extender?branch=develop)
[![Dependency Status](https://gemnasium.com/badges/github.com/Hooptaplabs/loopback-model-extender.svg)](https://gemnasium.com/github.com/Hooptaplabs/loopback-model-extender)
[![David-DM](https://david-dm.org/Hooptaplabs/loopback-model-extender.svg)](https://github.com/Hooptaplabs/loopback-model-extender)
