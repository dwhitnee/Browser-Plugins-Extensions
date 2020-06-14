// ==UserScript==
// @name         Swim Lanes
// @namespace    http://davidwhitney.net/
// @version      0.1
// @description  Display actual available lanes
// @author       David Whitney
// @match        https://sandpointcountryclub.getomnify.com/
// @grant        none
// ==/UserScript==

(function() {
   'use strict';

   //----------------------------------------
   function findTimes() {
     let allSlots = document.getElementsByClassName("card-availability");
     let i, slots = [];
     for (i=0; i < allSlots.length; i++) {
       if (allSlots[i].innerText.includes("1/1")) {
         slots.push( allSlots[i] );
       }
     }
     display("Found " + slots.length + " free lanes today");
     
     for (i=0; i< slots.length; i++) {
       display( slots[i].parentNode.parentNode.children[0].innerText );
     }
   }
   
   //----------------------------------------
   function display( text ) {
     var div = document.createElement("div");
     var content = document.createTextNode( text );
     div.appendChild( content );
     div.style.fontWeight = "bold";
     // div.style.fontSize = "1.2em";
     
     let header = document.getElementsByClassName("client-website-header")[0];
     // header[0].appendChild( div );
     let body = document.getElementsByClassName("client-schedule-body")[0];
     body.insertBefore( div, header ); 
   }



   // wait for page to render
   setTimeout( findTimes, 3000 );
})();