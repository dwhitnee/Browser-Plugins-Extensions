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
// NOTE: It runs only on page load so if you click to a day day you'll have
// to reload the page.
//----------------------------------------------------------------------


(function() {
   'use strict';

   //----------------------------------------
   // create the container we'll put results in and wait for page to load
   //----------------------------------------
   let container = createContainer();
   let lastDate = "";
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

     let pageLocation = 
       document.getElementsByClassName("client-website-header")[0];
     let body = document.getElementsByClassName("client-schedule-body")[0];
     body.insertBefore( div, pageLocation ); 

     return div;
   }

   //----------------------------------------
   // Guess what date is displayed based on current display
   //----------------------------------------
   function checkDate() {
     let elems = document.getElementsByClassName("date");
     if (elems.length) {
       return elems[0].innerText;  // "Wed, 17 Jun 2020"
     } else {
       return "";
     }
   }

   //----------------------------------------
   // see what the date is, if it's new, go get lane times
   //----------------------------------------
   function checkForNewData() {
     let date = checkDate();
     console.log("Date is " + date );

     if (date != lastDate) {
       // wipe slate
       while (container.childNodes.length) {
         container.removeChild( container.childNodes[0]);
       }
       lastDate = date;
       findTimes();
     }
   }

})();
