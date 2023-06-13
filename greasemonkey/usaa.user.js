// ==UserScript==
// @name          Archery Tournament entries
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   Find who's going to an archery tournament
// @include       https://usarchery.sport80.com/public/events/*
// @include       https://nfaausa.sport80.com/public/events/*
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

    let menu = document.getElementById( listId );

    // HACK: these menus f'ing dynamically populate so we have to
    // scroll to the bottom to get all the items
    menu.parentElement.scrollTo(0, 9999);

    setTimeout( () => {
      reallyParseEntries( listName, listId );
    }, 1000);
  }

  function reallyParseEntries( listName, listId ) {

    let menu = document.getElementById( listId );
    let list = menu.getElementsByClassName("v-list-item__title");
    let entries = [];

    for (let i = 0; i < list.length; i++) {
      entries.push( list[i].innerText );
    }

    let entryMap = {};

    entries.forEach( entry => {
      let [x, div, number] = entry.match(/(.*) \((\d+) Entries/);
      entryMap[number] = entryMap[number] || [];entryMap[number].push( div );
    });

    let output = "";

    const fragment = document.createDocumentFragment();
    const html = fragment
          .appendChild( document.createElement("section") )
          .appendChild( document.createElement("ul") );
    html.textContent = listName;

    html.style.background = "lightblue";
    html.style.padding = "1em 2em";
    html.style.marginTop = "1em";
    html.style.opacity = "90%";
    html.style.border = "solid gray 4px";
    html.style.borderRadius = "1em";

    html.style.position = "relative";
    html.style.left = "20%";
    html.style.width = "60%";

    let keys = Object.keys(entryMap).reverse();

    for (let j=0; j < keys.length; j++) {
      let key = keys[j];
      let divisions = entryMap[key];

      output = key + ":  ";
      if (divisions) {
        divisions.forEach( division => output += division + ", ");
      } else {
        output += "none";
      }

      let li = document.createElement("li");
      li.textContent = output;
      if (key == "0") {
        li.style.fontSize = "8pt";
      }
      html.appendChild( li );

      console.log( output );
    }

    document.getElementsByTagName("header")[0].appendChild( fragment );
//     document.body.appendChild( fragment );
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
