window.alert('PocketChangeChrome');
Components.utils.import("resource://pocketchange/PocketChange.js");

/**
 * PocketChangeChrome namespace.
 */
if ("undefined" == typeof(PocketChangeChrome)) {
  var PocketChangeChrome = {};
};


/**
 * Controls the browser overlay for the PocketChange extension.
 */
PocketChangeChrome.BrowserOverlay = {
  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {    
    let message;

    PocketChange.Fubar.changeString('fubar101');    
    message = PocketChange.Fubar.rhString;    

    window.alert(message);
  }
};


window.addEventListener("load", function(e) { PocketChangeChrome.BrowserOverlay.sayHello(e); }, false);