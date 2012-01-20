annoyancehider.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ annoyancehider.showFirefoxContextMenu(e); }, false);
};

annoyancehider.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
    // document.getElementById("context-annoyancehider").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { annoyancehider.onFirefoxLoad(); }, false);
