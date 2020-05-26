// ==UserScript==
// @name          Find cookies
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Find cookies
// @include       https://orteil.dashnet.org/*
// ==/UserScript==

(function() {

   function checkForCookies() {
     let cookieWrapper = document.getElementById("shimmers");
     
     if (cookieWrapper && cookieWrapper.children.length) {
       console.log("COOKIE!");
       cookieWrapper.style.height = "30em";   // sorta cheating
       cookieWrapper.style.width = "30em";
       cookieWrapper.style.backgroundColor = "yellow";
       cookieWrapper.children[0].click();   // super cheating
     } else {
       // restore?
       cookieWrapper.style.height = "";
       cookieWrapper.style.width = "";
       cookieWrapper.style.backgroundColor = "";
     }
   }

   // cast conjure baked goods when magic is at max
   function checkGrimoire() {
     let t = document.getElementById("grimoireBarText");
     let state = t.innerText.split("/");
     console.log( state[0] + " magic available");
     if (state[0] == state[1]) {       // max charge, lets cast a spell!
       console.log("CASTING SPELL!");
       let conjureBakedGoods = document.getElementById("grimoireSpell0");
       conjureBakedGoods.click();
    }
   }

   function doOnLoad() {
     setInterval( function() { checkForCookies(); }, 3 * 1000);
     setInterval( function() { checkGrimoire(); }, 1 * 60 * 1000);
   };

   doOnLoad();

})();
