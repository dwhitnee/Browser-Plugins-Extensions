var annoyancehider = {

  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("annoyancehider-strings");
  },

  // this is where the magic happens.
  // take selected dom element and hide it.
  onMenuItemCommand: function(e) {
    var promptService = 
      Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                .getService( Components.interfaces.nsIPromptService );

//     promptService.alert( window,
// 			 this.strings.getString("helloMessageTitle"),
// 			 this.strings.getString("helloMessage"));

    e.style.display ="none";
  },

  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    annoyancehider.onMenuItemCommand(e);
  }
};

window.addEventListener("load", function () { annoyancehider.onLoad(); }, false);
