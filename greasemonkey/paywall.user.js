// ==UserScript==
// @name          Undo paywall
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Undo paywall
// @include       http://seattletimes.com/*
// ==/UserScript==

document.body.className=document.body.className.replace(/noscroll/,'');
document.body.getElementsByClassName("hard_paywall")[0].style.display="none";

