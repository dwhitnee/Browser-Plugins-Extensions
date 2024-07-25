/*global NodeFilter */
/*jslint esversion: 8 */
// ==UserScript==
// @name          Earth Angel open ground missions
// @namespace     http://davidwhitney.net/projects/greasemonkey/
// @description   List ground missions only
// @include       https://volunteer.angelflightwest.org/mission/*
// ==/UserScript==


(function() {

  //----------------------------------------------------------------------
  // find all rides from flights
  //----------------------------------------------------------------------
  function findRides() {
    console.log("Finding rides...");

    let cards = document.getElementsByClassName("card");
    for (let c = 0; c < cards.length; c++) {
      let rides = cards[c].getElementsByClassName("ground");
      if (rides.length) {
        let rideNode = rides[0].nextElementSibling;

        // collect all text nodes under the ground transport line
        let textnode, rideInfo = [];
        let iter = document.createNodeIterator( rideNode, NodeFilter.SHOW_TEXT);
        while ((textnode = iter.nextNode())) {
          let text = textnode.textContent.trim();
          if (text) {
            rideInfo.push( text );
          }
        }

        let passenger = cards[c].children[1];
        let route = cards[c].children[2];  // and maybe child 3? (outbound, return) FIXME

        let name = passenger.children[0].children[1].innerText.replace(/\n/g, "");

        let flight = route.children[2].children[0];
        let date = flight.children[0].children[1].innerText;
        let time = flight.children[1].children[1].innerText;
        console.log( date + ": \"" + name + "\" " + rideInfo.join(" -> ") );
      }


      // let label = rides[i].getElementsByTagName("label")[0];
      // let listId = label.attributes["for"].value.match("input-(.*)")[1];
      // let listName = label.innerText;
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


  //----------------------------------------
  // ???
  //----------------------------------------
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
    // html.style.overflowY = "scroll";  // doesn't work

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

    return true;
    // return menus.length > 0;
  }


  function waitForPageLoad() {
    console.log("waiting...");

    let success = waitForMenus();

    if (success) {
      setTimeout( () => {
        findRides();  // wait a bit for menus to populate
      }, 1000);

    } else {
      setTimeout( () => {
        waitForPageLoad();  // wait a bit for menus to appear
      }, 1000);
    }
  }

  waitForPageLoad();

})();
