/**
 * Created by roger on 26/05/16.
 */

// To hide all logs
var originalLog		= console.log;
console.log = function(x) {};

// Runs uglifier
var NodeUglifier = require('node-uglifier');
var nodeUglifier = new NodeUglifier('./tmp-babel/index.js');
nodeUglifier.merge()/*.uglify()*/;

//exporting
nodeUglifier.exportToFile('./dist/index.js');

// Returns the original
console.log = originalLog;
