// ==UserScript==
// @name          Find cookies
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Find cookies
// @include       https://orteil.dashnet.org/*
// ==/UserScript==

(function() {

   function checkForCookies() {
     let cookieWrapper = document.getElementById("shimmers");
     
     if (cookieWrapper.children) {
       console.log("COOKIE!");
       cookieWrapper.style.height = "30em";
       cookieWrapper.style.height = "30em";
       cookieWrapper.style.backgroundColor = "yellow";
     } else {
       // restore?
       console.log("nope...");
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
