// ==UserScript==
// @name         Swim Lanes
// @namespace    http://davidwhitney.net/
// @version      0.1
// @description  Display actual available lanes
// @author       David Whitney
// @match        https://sandpointcountryclub.getomnify.com/
// @grant        none
// ==/UserScript==

//----------------------------------------------------------------------
//  The SPCC swimming pool currently has a reservation system by time
//  and lane, and it's very hard to tell which lanes are available
//  since all lanes and all times are displayed with a "0/1" or "1/1
//  available" message regardless of whether they are available.
// 
// This script filters out all the "0/1" lanes (ie, the unavailable lanes).
// 
// TO INSTALL: first you need the Chrome TamperMonkey or 
// Firefox GreaseMonkey extension installed on your browser.
// Then just click the "RAW" button on this page and the browser
// should interpret that file as a script to install. 
//----------------------------------------------------------------------

(function() {
   'use strict';

   //----------------------------------------
   // create the container we'll put results in and wait for page to load
   //----------------------------------------
   let container = createContainer();
   let lastDate = "";
   let numDates = 0;
   setInterval( checkForNewData, 1000 );



   //----------------------------------------
   // look through all lanes listed and find the few that are available
   //----------------------------------------
   function findTimes() {
     let allSlots = document.getElementsByClassName("card-availability");
     let i, slots = [];
     for (i=0; i < allSlots.length; i++) {
       if (allSlots[i].innerText.includes("1/1")) {
         slots.push( allSlots[i] );
       } else {
         // hide taken lanes
         allSlots[i].parentElement.parentElement.parentElement.parentElement.style.display="none";
       }
     }

     if (slots.length) {
       display("Found " + slots.length + " free lanes for " + lastDate);
       for (i=0; i< Math.min( slots.length, 15); i++) {
         display("* " + slots[i].parentNode.parentNode.children[0].innerText );
       }
       if (slots.length > 15) {
         display("* more...");
       }
     } else {
       display("Just a sec...");
     }
   }
   
   //----------------------------------------
   function display( text ) {
     container.appendChild( createTextDiv( text )); 
     container.style.display="block";
   }

   //----------------------------------------
   // create a text div
   //----------------------------------------
   function createTextDiv( text ) {
     var div = document.createElement("div");
     var content = document.createTextNode( text );
     div.appendChild( content );
     return div;
   }

   //----------------------------------------
   // create a container to hold lane listing
   //----------------------------------------
   function createContainer() {
     let div = createTextDiv("Hello");
     div.style.border = "green 5px solid";
     div.style.padding = "0.5em";
     div.style.fontWeight = "bold";
     div.style.position = "fixed";
     div.style.zIndex = "1000";
     div.style.background = "white";
     div.style.opacity = "80%";
     div.setAttribute("draggable", "true");

     div.setAttribute("onclick", "event.currentTarget.style.display='none'");

     div.setAttribute("ondragstart", "event.dataTransfer.setData(\"text\", event.target.id)'");

     let pageLocation = 
       document.getElementsByClassName("client-website-header")[0];
     let body = document.getElementsByClassName("client-schedule-body")[0];
     body.insertBefore( div, pageLocation ); 

     // alas can't add a functio to global scope from greasemonkey,
     // too weird to do inline
     document.body.setAttribute("ondrop", "SPCC_Drop(event)"); 
     document.body.setAttribute("ondragover", "event.preventDefault()");

     return div;
   }

   //----------------------------------------
   // Guess what date is displayed based on current display
   //----------------------------------------
   function pageHasChanged() {
     let date = "";
     let elems = document.getElementsByClassName("date");

     if (elems.length) {
       date = elems[0].innerText;  // "Wed, 17 Jun 2020"
     }
     
     console.log("Date is " + date );

     // if the date has changed or more lanes added to the page
     let hasChanged = (date != lastDate) || (numDates != elems.length);

     // update state
     lastDate = date;
     numDates = elems.length;

     return hasChanged;
   }

   //----------------------------------------
   // see what the date is, if it's new, go get lane times
   //----------------------------------------
   function checkForNewData() {
     if (pageHasChanged()) {

       // wipe slate
       while (container.childNodes.length) {          
         container.removeChild( container.childNodes[0]);
       }

       findTimes();
     }
   }

})();
