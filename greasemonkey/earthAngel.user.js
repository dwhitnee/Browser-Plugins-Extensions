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
    let rideDescriptions = [];

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

        rideDescriptions.push(date + " (" + time + ")" + "| \"" + name + "\" " + rideInfo.join(" -> ") );
      }

    }
    displayRides( rideDescriptions );
  }


  //----------------------------------------
  // Create a div to stuff output into
  //----------------------------------------
  function displayRides( rides ) {

    let output = "";

    const fragment = document.createDocumentFragment();
    const html = fragment
          .appendChild( document.createElement("section") )
          .appendChild( document.createElement("ul") );
    html.textContent = "Ground Rides";

    html.style.background = "lightblue";
    html.style.padding = "1em 2em";
    html.style.marginTop = "1em";
    html.style.opacity = "90%";
    html.style.border = "solid gray 4px";
    html.style.borderRadius = "1em";

    html.style.position = "relative";
    html.style.left = "10%";
    html.style.width = "80%";
    // html.style.overflowY = "scroll";  // doesn't work

    for (let i=0; i < rides.length; i++) {
      console.log( rides[i] );
      let li = document.createElement("li");
      li.textContent = rides[i];
      html.appendChild( li );
    }
    console.log( output );

    document.getElementsByClassName("main-header")[0].appendChild( fragment );
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
