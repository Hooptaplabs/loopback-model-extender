/**
 * Created by roger on 26/05/16.
 */

var NodeUglifier = require('node-uglifier');
var nodeUglifier = new NodeUglifier('./tmp-babel/index.js');
nodeUglifier.merge()/*.uglify()*/;

//exporting
nodeUglifier.exportToFile('./dist/index.js');
