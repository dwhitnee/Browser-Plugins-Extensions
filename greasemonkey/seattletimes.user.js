// ==UserScript==
// @name          Seattle Times print edition cleanup
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Fix Seattle Times layout to my liking
// @include       http://digital.olivesoftware.com/Olive/ODN/SeattleTimes/*
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
     addGlobalStyle('div#toolbar { top: 0; }');
     addGlobalStyle('div#restHeightContainer { top: 4em; z-index: 1;}');
   }

   doOnLoad();
})();
