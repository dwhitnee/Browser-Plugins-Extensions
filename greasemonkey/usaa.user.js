// ==UserScript==
// @name          Archery Tournament entries
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Find who's going to an archery tournament
// @include       https://usarchery.sport80.com/public/events/*
// ==/UserScript==


(function() {

  //----------------------------------------------------------------------
  // find all menus and look through contents
  //----------------------------------------------------------------------
  function parseMenus() {
    console.log("Finding contents of menus...");
    let menus = document.getElementsByClassName("v-select__slot");

    // make menus show up
    document.getElementsByClassName("s80-filter")[0].getElementsByTagName("button")[0].click();

    for (var m = 0; m < menus.length; m++ ) {
      let label = menus[m].getElementsByTagName("label")[0];
      let listId = label.attributes["for"].value.match("input-(.*)")[1];
      let listName = label.innerText;

      parseEntries( listName, "list-" + listId );
    };
  };


  //----------------------------------------------------------------------
  // Sort all entries in menu into useful form
  //----------------------------------------------------------------------
  function parseEntries( listName, listId ) {

    console.log( listName );
    let list = document.getElementById( listId ).getElementsByClassName("v-list-item__title");
    let entries = [];

    for (let i = 0; i < list.length; i++) {
      entries.push( list[i].innerText );
    }

    let entryMap = {};

    entries.forEach( entry => {
      let [x, div, number] = entry.match(/(.*) \((\d+) Entries/);
      entryMap[number] = entryMap[number] || [];entryMap[number].push( div );
    });

    for (let j=Object.keys(entryMap).length; j >= 0; j--) {
      console.log( j );
      if (entryMap[j]) {
        entryMap[j].forEach(e => console.log(e));
      } else {
        console.log("none");
      }
    }
  }


  //----------------------------------------------------------------------
  // wait for menu elements to appear, then click them all
  //----------------------------------------------------------------------
  function waitForMenus() {
    let menus = document.getElementsByClassName("v-select__slot");

    if (menus.length) {
      clickAllMenus();
      return true;
    } else {
      return false;
    }
  }


  function clickAllMenus() {
    // click everything (and wait)
    let buttons = document.getElementsByClassName("v-input__slot");
    for (let b=0; b< buttons.length; b++) {
      buttons[b].click();
    }
  }

  function waitForPageLoad() {
    console.log("waiting...");

    let success = waitForMenus();

    if (success) {
      setTimeout( () => {
        parseMenus();  // wait a bit for menus to populate
      }, 1000);

    } else {
      setTimeout( () => {
        waitForPageLoad();  // wait a bit for menus to appear
      }, 1000);
    }
  }

   waitForPageLoad();

})();
