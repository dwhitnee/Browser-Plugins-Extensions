// ==UserScript==
// @name          Facebook de-tabletify
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Fix Facebook's tablet-centric layout
// @include       https://www.facebook.com/*
// ==/UserScript==

(function() {

   function addGlobalStyle(css) {
     var head, style;
     head = document.getElementsByTagName('head')[0];
     if (!head) { return; }
     style = document.createElement('style');
     style.type = 'text/css';
     style.innerHTML = css;
     head.appendChild(style);
   }

   function doOnLoad() {
     addGlobalStyle('div#rightCol { display: none; }');
     addGlobalStyle('div#globalContainer { margin: 0; }');
     addGlobalStyle('div#contentArea { width: 90% !important; padding-left: 1em; }');
     addGlobalStyle('div.mbm { margin-bottom: 3em; }');

     // loseRightColumn();
     // muckWithPostSpacing();
     // setTimeout( muckWithPostSpacing, 3000 );
     // setTimeout( muckWithPostSpacing, 8000 );
   };

   doOnLoad();

   function loseRightColumn() {
     document.getElementById("rightCol").style.display="none";
     document.getElementById("globalContainer").style.margin="0";
     document.getElementById("contentArea").style.width="90%";
     document.getElementById("contentArea").style.paddingLeft="1em";
   };

/*
   document.addEventListener( 
     "DOMContentLoaded", 
     function() {
       document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
       doOnLoad();
     }, 
     false );
*/
})();
