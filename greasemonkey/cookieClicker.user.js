// ==UserScript==
// @name          Find cookies
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   So much cheating
// @version      0.1
// @include       https://orteil.dashnet.org/*
// ==/UserScript==

(function() {
    'use strict';

   // Two strategies
   // 1) ConjureBakedGoods as often as possible (+30min of cookies)
   // 1a) ConjureBakedGoods during a frenzy to increase chance of multiplier
   // 2) ForceHandOfFate (extra magic cookie) when any magic cookie frenzy
   //    potentially multiplying their effects.  

   let spellWasCast = false;
   let itsAGoodTimeToCastASpell = false;
   let spells = { 
     0: "Conjure Baked Goods", 
     1: "Force Hand of Fate",
     8: "Diminish Ineptitude"
   };
   let ConjureBakedGoods = 0;   
   let ForceHandOfFate = 1;
   let DiminishIneptitude = 8;

   //----------------------------------------
   // if nothing happens for 30 minutes set a flag to say 
   // cast a spell anyway
   //----------------------------------------
   function inactivityCheck() {
     if (!spellWasCast) {
       console.log("No spells in 30 minutes");
       itsAGoodTimeToCastASpell = true;   // cast one at next opportunity
     } else {
       spellWasCast = false;  // reset activity flag
     }
     setTimeout( inactivityCheck, 30 * 60 * 1000 ); // check back in 30 min
   }

   //------------------------------
   // click magic cookies when they appear. If they lead to a frenzy then 
   // try to stack them with a spell
   //------------------------------
   function checkForCookies() {
     let cookieWrapper = document.getElementById("shimmers");
     
     if (cookieWrapper && cookieWrapper.children.length) {
       console.log("COOKIE!");
       timeStamp();
       // could be a cookie storm, so click all the cookies in there
       for (var i=0; i< cookieWrapper.children.length; i++) {
         cookieWrapper.children[i].click();   // super cheating
       }

       // worth a try to double up cookie effects
       // Holy Grail here is a Frenzy plus a click Frenzy plus 1000 clicks
       if (isFrenzy()) {
         console.log("Frenzy!");
         if (fullManna()) {
           console.log("DOUBLE UP!");
           castSpell( ConjureBakedGoods );
           // castSpell( DiminishIneptitude );  // too expensive? worthless
           // castSpell( ForceHandOfFate );  // this is better but $$$
         }
         spamCookie( 26 );  // click frenzy is 13-26 seconds
       }
     }
   }
     

   //----------------------------------------
   // Did the current Golden cookie trigger a multiplier - these stack so
   // it's a good time to force a second cookie or Conjure Baked Goods.
   // 
   // x20: "Frenzy. Cookie production x7 for 2 minutes, 34 seconds"
   // x777: "Click frenzy Clicking power x777 for 26 seconds!" (a full day of cookies)
   // x16: "Luxuriant harvest [farms/10] Cookie production +1600% for 1 minute!"
   // x20: "High-five [cursors/10] Cookie production +2000% for 1 minute!"
   // x13: "Oiled-up Your 130 factories are boosting your CpS!Cookie production +1300% for 1 minute!"
   // x1:  "Lucky! +96.171 trillion cookies!": One time cookies (no frenzy)
   // x30: Conjure baked goods equivalent
   // 1/20x: Recession Your 180 banks are rusting your CpS! Cookie production 1800% slower for 1 minute!
   //----------------------------------------
   function isFrenzy() {
     // particle0 contains the description of the last golden cookie effect
     let bonus = document.getElementById("particle0").innerText;
     console.log( bonus );

     return bonus.includes("frenzy") || 
       bonus.match("Cookie production [+x]");

     // (bonus.includes("Cookie production") && !bonus.includes("slower"));
   }

   //-----------------------------------------
   // 0: Conjure Baked Goods
   // 1: Force Hand of Fate
   //-----------------------------------------
   function castSpell( spellId ) {
     console.log("CASTING SPELL " + spells[spellId]); timeStamp();
     let spell = document.getElementById("grimoireSpell"+spellId);
     spell.click();
     spellWasCast = true;
     itsAGoodTimeToCastASpell = false;
     let notes = document.getElementById("notes");
     console.log( notes.innerText );  // log what spell did
   }

   //----------------------------------------
   // Check our manna. We can't if the grimoire is closed or browser window 
   // sleeps so the element is no longer updated.
   // @return true if magic meter is at maximum, or 30 min elapsed
   //----------------------------------------
   function fullManna() {
     let t = document.getElementById("grimoireBarText");

     // Format of magic: "33/36 (+0.03/s)"
     let manna = t.innerText.split(" ")[0].split("/");

     // we're either at max magic or it's been 30 minutes
     return (manna[0] == manna[1]) || itsAGoodTimeToCastASpell;
   }   

   //------------------------------
   // cast Conjure Baked Goods when magic is at max
   //------------------------------
   function checkGrimoire() {
     if (fullManna()) {
       castSpell( ConjureBakedGoods );
     }
   }

   //----------------------------------------
   // auto click for N seconds
   //----------------------------------------
   function spamCookie( times ) {
     let bigCookie = document.getElementById("bigCookie");

     times = 100*times;     // 100 click/sec

     let spammer = setInterval( 
       function() { 
         bigCookie.click(); 
         if (--times == 0) {
           clearInterval( spammer );
         }
       }, 10);  // every 10ms
   }

   //----------------------------------------
   function timeStamp() {
     let c = new Date();
     console.log( c.toLocaleTimeString() );
   }

   //----------------------------------------
   // set up auto checks (cookies, esp in cookie chains only last a second)
   //----------------------------------------
   function doOnLoad() {
     setInterval( function() { checkForCookies(); }, 1 * 1000);  // 1 sec
     setTimeout( inactivityCheck, 30 * 60 * 1000 );   // 30 min
   };

   // start the timers
   doOnLoad();

})();


/*
   // raise a big yellow flag
   function raiseAlert() {
     let cookieWrapper = document.getElementById("shimmers");
     cookieWrapper.style.height = "30em";
     cookieWrapper.style.width = "30em";
     cookieWrapper.style.backgroundColor = "yellow";
   }
*/