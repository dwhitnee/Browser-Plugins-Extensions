// ==UserScript==
// @name          Find cookies
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   So much cheating, but this is not an auto-clicker
// @version      0.1
// @include       https://orteil.dashnet.org/*
// ==/UserScript==

//----------------------------------------------------------------------
// Cookie Clicker is the ultimate example of digital manual labor,
// so after playing for a while I could not help but to automate the
// things I was doing manually over and over.
// 
// The goal here is not to outright cheat, but to take the ethos of the
// game even farther. You click until you can hire grandmas, you hire
// grandmas until you can get a farm, etc, etc, all the way up to
// Javascript Consoles. I figure a GreaseMonkey script is just the
// next logical step in upgrades.
//
// This is not a blind autoclicker, it reacts in a scripted way to
// expected events and automates the clicks I would have done
// (and have done) in each situation. For example, this does not
// blindly click the big cookie, but it does auto-click Golden Cookies
// when they appear. And when that cookie triggers a frenzy it *does*
// auto clikck the big cookie for 20 seconds because that's what I
// would have done in that situation (but it can click much faster, I
// feel a small amount of guilt over that, but not much). Also, if
// there is a multiplier it will cast a spell in hopes of stacking
// effects (but only if we are at max mana because that's how I would play.)
// 
// I don't advise blindly using this because where is the fun in that?
// If you learn something from this, great. I did.
//----------------------------------------------------------------------


(function() {
   'use strict';

   // Two strategies
   // 1) ConjureBakedGoods during a CpS frenzy to maximize Baked Goods effect
   // 2) ForceHandOfFate (extra magic cookie) when clicking frenzy (x777) occurs
   //    potentially multiplying their effects.  

   let spellWasCast = false;
   let itsAboutTimeToCastASpell = false;
   let spells = { 
     0: "Conjure Baked Goods", 
     1: "Force Hand of Fate",
     8: "Diminish Ineptitude"
   };
   let ConjureBakedGoods = 0;   
   let ForceHandOfFate = 1;
   let DiminishIneptitude = 8;

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

       // If magic to spare it's worth a try to double up cookie effects
       // Holy Grail here is a multiplied click Frenzy (plus 1000 clicks)
       if (isFrenzy()) {              // our CpS has increased temporarily
         if (isClickingFrenzy()) {
           console.log("Clicking Frenzy!");
           castSpell( ForceHandOfFate );   // hoping to multiply each click
         } else {
           console.log("Production Frenzy!");
           if (fullMana()) {           // maximize spell if we can afford it
             castSpell( ConjureBakedGoods );
           }
           // castSpell( DiminishIneptitude );  // too expensive? worthless
         }
         spamCookie( 26 );  // click frenzy is 13-26 seconds
       }
     }
   }
     

   //----------------------------------------
   // @return true if the current Golden Cookie triggered a +CpS multiplier 
   // it's a good time to Conjure Baked Goods (30 min of CpS)
   // 
   // x20: "Frenzy. Cookie production x7 for 2 minutes, 34 seconds"
   // x666:"Elder frenzy Cookie production x666 for 14 seconds!"
   // x16: "Luxuriant harvest [farms/10] Cookie production +1600% for 1 minute!"
   // x20: "High-five [cursors/10] Cookie production +2000% for 1 minute!"
   // x13: "Oiled-up Your 130 factories are boosting your CpS!Cookie production +1300% for 1 minute!"
   // x30: [Conjure baked goods equivalent]
   //
   // Not a frenzy:
   // x1:  "Lucky! +96.171 trillion cookies!": One time cookies (no frenzy)
   // 1/20x: Recession Your 180 banks are rusting your CpS! Cookie production 1800% slower for 1 minute!
   //----------------------------------------
   function isFrenzy() {
     // particle0 contains the description of the last golden cookie effect
     let bonus = document.getElementById("particle0").innerText;
     console.log( bonus );

     // catch "x7" or "+700%"
     return bonus.match("Cookie production [+x]") || isClickingFrenzy();
   }

   //----------------------------------------
   // @return true if each click has been massively increased
   //
   // "Click frenzy Clicking power x777 for 26 seconds!"
   // "Cursed finger Cookie production halted for 22 seconds, but each click is worth 22 seconds of CpS."
   // "Dragonflight Clicking power x1111 for 22 seconds!"
   //----------------------------------------
   function isClickingFrenzy() {
     let bonus = document.getElementById("particle0").innerText;
     return bonus.includes("Clicking power") || bonus.includes("halted"); 
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
     itsAboutTimeToCastASpell = false;
     let notes = document.getElementById("notes");
     console.log( notes.innerText );  // log what spell did
   }

   //----------------------------------------
   // Check our mana. We can't if the grimoire is closed or browser window 
   // sleeps so the element is no longer updated.
   // @return true if magic meter is at maximum, or 30 min elapsed
   //----------------------------------------
   function fullMana() {
     let t = document.getElementById("grimoireBarText");

     // Format of magic: "33/36 (+0.03/s)"
     let mana = t.innerText.split(" ")[0].split("/");

     // we're either at max magic or it's been 30 minutes
     return (mana[0] == mana[1]) || itsAboutTimeToCastASpell;
   }   

   //------------------------------
   // cast Conjure Baked Goods when magic is at max
   //------------------------------
   function checkGrimoire() {
     if (fullMana()) {
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
   // if nothing happens for 30 minutes set a flag to say 
   // cast a spell anyway
   //----------------------------------------
   function inactivityCheck() {
     if (!spellWasCast) {
       console.log("No spells in 30 minutes");
       itsAboutTimeToCastASpell = true;   // cast one at next opportunity
     } else {
       spellWasCast = false;  // reset activity flag
     }
     setTimeout( inactivityCheck, 30 * 60 * 1000 ); // check back in 30 min
   }

   //----------------------------------------
   // set up auto checks (cookies, esp in cookie chain,s only last a second)
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