// ==UserScript==
// @name          Fix My Yahoo Column widths 33/66gi
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   tv.com add episode list on main page
// @include       http://my.yahoo.com/*
// ==/UserScript==

//----------------------------------------
// Fix the crap yahoo did to the 2014 my.yahoo.com layouts
// Remove ad, and change to 2 column 33/66
//
// 2014, David Whitney
//---------------------------------------- 

var ad = document.getElementById("my-adsLREC");
ad.style.display = "none";

var columns = document.getElementsByClassName("myColumn");

columns[0].style.width="33%";
columns[1].style.width="100%";
