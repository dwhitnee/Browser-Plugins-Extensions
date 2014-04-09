// ==UserScript==
// @name          Undo paywall
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Undo paywall
// @include       http://seattletimes.com/*
// ==/UserScript==

(function() {

   function hidePaywall() {
     document.body.className=document.body.className.replace(/noscroll/,'');
     document.body.getElementsByClassName("hard_paywall")[0].style.display="none";
   }

   function hideAds() {
     hide( document.body.getElementsByClassName("ads_wrapper"));
     hide( document.getElementsByClassName("co_ad_label"));
   }

   function hide( ads ) {
     for (var i = 0; i < ads.length; i++) {
       ads[i].style.display="none";
     }
   };
   
   function doOnLoad() {
     hidePaywall(); 
     hideAds(); 
   };

   doOnLoad();

/*
   document.addEventListener( 
     "DOMContentLoaded", 
     function() {
       document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
       doOnLoad();
     }, 
     false );
*/
})();
