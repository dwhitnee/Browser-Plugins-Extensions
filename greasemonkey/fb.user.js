// ==UserScript==
// @name          Facebook de-tabletify
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Fix Facebook's tablet-centric layout to my liking
// @include       https://www.facebook.com/*
// ==/UserScript==

(function() {

  function removeSideBars() {
    let rightNav = document.querySelector("[role=complementary]");
    let navs = document.querySelectorAll("[role=navigation]");
    console.log("navs = " + navs.length );

    if (rightNav) {
      rightNav.style.display="none";
    }

    if (navs[2]) {
      navs[2].style.display="none";
    }
  }

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  function doOnLoad() {
    addGlobalStyle('div#rightCol { display: none; }');
    addGlobalStyle('div#globalContainer { margin: 0; }');
    addGlobalStyle('div#contentArea { width: 90% !important; padding-left: 1em !important; position: inherit; }');
    addGlobalStyle('div.mbm { margin-bottom: 3em; }');

    addGlobalStyle('div#globalContainer + div { display: none; }');
  }

  setTimeout( () => {
    removeSideBars();
  }, 2000);

})();
