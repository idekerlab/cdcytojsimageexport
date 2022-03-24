#!/usr/bin/env node


const { ArgumentParser }  = require('argparse');
const { version } = require('../package.json');

const fs = require('fs');

var cytosnap = require('cytosnap');
var cytoscape = require('cytoscape');

const { CxToJs, CyNetworkUtils } = require('cytoscape-cx2js');

const parser = new ArgumentParser({
    description: "Runs Cytoscape.js image export on the command line outputting png image"
});

parser.add_argument('input', {help: 'File of Network in CX format'});
parser.add_argument('--version', { action: 'version', version });
parser.add_argument('--width', {help: 'Width of exported image', type: 'int', default: 1024});
parser.add_argument('--height', {help: 'Height of exported image', type: 'int', default: 768});



var args = parser.parse_args();

// read CX file
var content = fs.readFileSync(args.input);
var rawCX = JSON.parse(content);

// initialize cytoscapeCx2js
var utils = new CyNetworkUtils();
var niceCX = utils.rawCXtoNiceCX(rawCX);
var cx2Js = new CxToJs(utils);

// initialize cytoscape.js
var cy = cytoscape({});

var attributeNameMap = {};

// add the elements from the CX file into cytoscape.js
var eles = cy.add(cx2Js.cyElementsFromNiceCX(niceCX, attributeNameMap));
var style = cx2Js.cyStyleFromNiceCX(niceCX, attributeNameMap)
var layout = cx2Js.getDefaultLayout();
if (layout !== undefined){
  layout.fit = true;
}


var nodes = cy.filter('node');
var num_nodes = nodes.length;
var node_size = 75.0
var box_size = Math.sqrt(node_size*node_size*num_nodes);

if (box_size < 500.0){
  box_size = 500;
}

var snap = cytosnap({
  args: ['--no-sandbox', '--window-size=' + args.width + ',' + args.height]
})
snap.start().then(function(){
  return snap.shot({
    //elements: [ // http://js.cytoscape.org/#notation/elements-json
    //  { data: { id: 'foo' } },
    //  { data: { id: 'bar' } },
    //  { data: { source: 'foo', target: 'bar' } }
    //],
    elements: cy.elements().jsons(),

    // TODO: Need to use preset layout and get coordinates
    //layout: { // http://js.cytoscape.org/#init-opts/layout
    //  name: 'grid',  // you may reference a `cytoscape.use()`d extension name here
    //  fit: true
   //},
    layout: layout,
    style: style,
    resolvesTo: 'base64',
    format: 'png',
    width: args.width,
    height: args.height,
    background: 'transparent'
  });
}).then(function( img ){
  // do whatever you want with img
  const buffer = Buffer.from(img, "base64");
  process.stdout.write( buffer );

  snap.stop().then(function(){ // promise resolved on stop
    //console.log('chained stop promise');
  });
  
});



// denote we ran successfully
process.exitCode = 0