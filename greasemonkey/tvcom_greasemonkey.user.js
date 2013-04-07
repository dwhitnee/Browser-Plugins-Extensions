// ==UserScript==
// @name          tv.com add episode list on main page
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   tv.com add episode list on main page
// @include       http://www.tv.com/*/show/*
// ==/UserScript==

// add a link from/to
// http://www.tv.com/house/show/22374/summary.html
// http://www.tv.com/house/show/22374/episode_listings.html

var page = window.location.href;
page = page.replace( /summary.html/, "episode_listings.html?season=0&");

var nav = document.getElementById("content_nav");

if (nav) {
    var listItems = nav.getElementsByTagName('li');
    if (listItems) {
	var firstItem = listItems.item( 1 );
	firstItem.innerHTML += "<a href="+page+"><span>ALL EPISODES</span></a>";
    }
}

// var link = document.createElement("a");
// link.innerHTML = "ALL EPISODES!";
// link.setAttribute('href', page);
// nav.appendChild( link );

