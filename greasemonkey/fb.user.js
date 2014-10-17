// ==UserScript==
// @name          Facebook de-tabletify
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Fix Facebook's tablet-centric layout to my liking
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
     addGlobalStyle('div#contentArea { width: 90% !important; padding-left: 1em !important; }');
     addGlobalStyle('div.mbm { margin-bottom: 3em; }');

     addGlobalStyle('div#globalContainer + div { display: none; }');
   }

   doOnLoad();

})();
