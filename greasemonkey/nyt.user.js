// ==UserScript==
// @name          NYT Crosswords without ads
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Remove the ads from NYT crossword page. We already paid $40 for the damsn thing
// @include       http://www.nytimes.com/*
// ==/UserScript==

(function() {

   function removeAds() {
     var ads = document.getElementsByClassName("ad");

     for (var i=0; i < ads.length; i++) {
       ads[i].style.setProperty("display", "none", "important");
     }

     console.log("NYT ads");
   }

   setTimeout( removeAds, 5000 );
   setTimeout( removeAds, 10000 );

})();
