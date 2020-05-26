/**
 *   Add a context menu item to Firefox. Whatever HTML element we are
 *   hovering over will be hidden when clicked.
 * 
 *   David Whitney, 2016 
*/

var self = require("sdk/self");

// a dummy function, to show how tests work.
// to see how to test this function, look at test/test-index.js
function dummy(text, callback) {
  callback(text);
}

exports.dummy = dummy;


var menu = require("sdk/context-menu");

// not sure why this does not fire on <img> tags
menu.Item({
    label: "Hide this annoyance",
    context: menu.PageContext(),
    contentScript: 'self.on("click", function( element ) {' +
 	'  element.style.display = "none"; ' +
        '  self.postMessage( element );' +
        '});',
    onMessage: function( element ) {
	console.log("Hid an annoying element");
    }
});

menu.Item({
  label: "Hide this annoying image",
  context: menu.SelectorContext("img"),
    contentScript: 'self.on("click", function( element ) {' +
 	'  element.style.display = "none"; ' +
        '});'
});
