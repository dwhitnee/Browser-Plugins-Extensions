// ==UserScript==
// @name          Block weird ad things
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Block weird ad things
// @include       *.yahoo.com
// ==/UserScript==

// look for specific divs and hide them.

var page = window.location.href;
page = page.replace( /summary.html/, "episode_listings.html?season=0&");


var ads = [".yom-ad",".ad_slug_table"];

for (var i=0; i < ads.length; i++) {
  var ad = document.querySelector( ads[i] );
  if (ad) {
   ad.style.display="none";
  } 
}