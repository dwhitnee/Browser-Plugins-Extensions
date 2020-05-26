// ==UserScript==
// @name          Find cookies
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   So much cheating
// @include       https://orteil.dashnet.org/*
// ==/UserScript==

(function() {

   let spellWasCast = false;

   //----------------------------------------
   // if nothing happens for 30 minutes cast a spell anyway
   //----------------------------------------
   function inactivityCheck() {
     if (!spellWasCast) {
       console.log("No spells in 30 minutes");
       castConjureBakedGoods();
     }
     spellWasCast = false;
     setTimeout( inactivityCheck, 30 * 60 * 1000 );
   }

   //------------------------------
   // click magic cookies when they appear
   //------------------------------
   function checkForCookies() {
     let cookieWrapper = document.getElementById("shimmers");
     
     if (cookieWrapper && cookieWrapper.children.length) {
       console.log("COOKIE!");
       timeStamp();
       for (var i=0; i< cookieWrapper.children.length; i++) {
         cookieWrapper.children[i].click();   // super cheating
       }
       spamCookie( 1000 );
     }
   }

   // raise a big yellow flag
   function raiseAlert() {
     let cookieWrapper = document.getElementById("shimmers");
     cookieWrapper.style.height = "30em";
     cookieWrapper.style.width = "30em";
     cookieWrapper.style.backgroundColor = "yellow";
   }

   //----------------------------------------
   // auto click N times
   //----------------------------------------
   function spamCookie( times ) {
     let bigCookie = document.getElementById("bigCookie");

     // click every 10ms
     let spammer = setInterval( 
       function() { 
         bigCookie.click(); 
         if (--times == 0) {
           clearInterval( spammer );
         }
       }, 10);
   }


   //-----------------------------------------
   function castConjureBakedGoods() {
     console.log("CASTING SPELL!"); timeStamp();
     let conjureBakedGoods = document.getElementById("grimoireSpell0");
     conjureBakedGoods.click();
     spellWasCast = true;
   }
   
   //------------------------------
   // cast Conjure Baked Goods when magic is at max
   // Format of magic: "33/36 (+0.03/s)"
   // This fails if the grimoire is closed or window sleeps so this element
   // is no longer updated.
   // Cast a spell every 15 minutes instead? 
   // How to check for sleep? If no spell for 30 min, auto cast?
   // 
   // At highter levels Force the Hand of Fate when a cookie shows up is
   // probably better
   //------------------------------
   function checkGrimoire() {
     let t = document.getElementById("grimoireBarText");

     // Format of magic: "33/36 (+0.03/s)"
     let manna = t.innerText.split(" ")[0].split("/");

     if (manna[0] == manna[1]) {       // max charge
       castConjureBakedGoods();
     }
   }

   //----------------------------------------
   function timeStamp() {
     let c = new Date();
     console.log( c.toLocaleTimeString() );
   }

   //----------------------------------------
   // set up auto checks
   //----------------------------------------
   function doOnLoad() {
     setInterval( function() { checkForCookies(); }, 3 * 1000);  // 3 sec
     setInterval( function() { checkGrimoire(); }, 60 * 1000);  // 1 min  
     setTimeout( inactivityCheck, 30 * 60 * 1000 );   // 30 min
   };

   // start the process
   doOnLoad();

})();
