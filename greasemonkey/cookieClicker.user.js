// ==UserScript==
// @name          Find cookies
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   So much cheating
// @include       https://orteil.dashnet.org/*
// ==/UserScript==

(function() {

   //------------------------------
   // click magic cookies when they appear
   //------------------------------
   function checkForCookies() {
     let cookieWrapper = document.getElementById("shimmers");
     
     if (cookieWrapper && cookieWrapper.children.length) {
       console.log("COOKIE!");
       timeStamp();
       // cookieWrapper.style.height = "30em";   // sorta cheating
       // cookieWrapper.style.width = "30em";
       // cookieWrapper.style.backgroundColor = "yellow";
       cookieWrapper.children[0].click();   // super cheating
       spamCookie( 100 );
     } else {
       // restore?
       // cookieWrapper.style.height = "";
       // cookieWrapper.style.width = "";
       // cookieWrapper.style.backgroundColor = "";
     }
   }

   //----------------------------------------
   // auto click N times
   //----------------------------------------
   function spamCookie( times ) {
     let bigCookie = document.getElementById("bigCookie");
     let spammer = setInterval( 
       function() { 
         bigCookie.click(); 
         if (--times == 0) {
           clearInterval( spammer );
         }
       }, 10);
   }

   //------------------------------
   // cast conjure baked goods when magic is at max
   //------------------------------
   function checkGrimoire() {
     let t = document.getElementById("grimoireBarText");
     let state = t.innerText.split("/");
     // console.log( state[0] + " magic available");
     if (state[0] == state[1]) {       // max charge
       console.log("CASTING SPELL!");
       timeStamp();
       let conjureBakedGoods = document.getElementById("grimoireSpell0");
       conjureBakedGoods.click();
    }
   }

   function timeStamp() {
     let c = new Date();
     console.log( c.toLocaleTimeString() );
   }

   //----------------------------------------
   // set up auto checks
   //----------------------------------------
   function doOnLoad() {
     setInterval( function() { checkForCookies(); }, 3 * 1000);
     setInterval( function() { checkGrimoire(); }, 60 * 1000);
   };

   doOnLoad();

})();
