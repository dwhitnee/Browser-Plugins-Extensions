// ==UserScript==
// @name          Find cookies
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Find cookies
// @include       https://orteil.dashnet.org/cookieclicker/
// ==/UserScript==

(function() {

   function checkForCookies() {
     let cookieWrapper = document.body.getElementById("shimmers");
     let cookie = document.body.getElementById("shimmer");

     if (cookie) {
       cookieWrapper.style.height = "30em";
       cookieWrapper.style.height = "30em";
       cookieWrapper.style.backgroundColor = "yellow";
     } else {
       // restore?
       cookieWrapper.style.height = "";
       cookieWrapper.style.height = "";
       cookieWrapper.style.backgroundColor = "";
     }
   }

   function doOnLoad() {
     setInterval( function() { checkForCookies(); }, 3000);
   };

   doOnLoad();

})();
