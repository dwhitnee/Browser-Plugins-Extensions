// ==UserScript==
// @name          NYT Crosswords without ads
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Remove the ads from NYT crossword page. We already paid $40 for the damsn thing
// @include       http://www.nytimes.com/*
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

   function removeAds() {
     addGlobalStyle('.ad { display: none !important; }');
   }

   removeAds();

})();
