// is this necessary? i don't think so
//Components.utils.import("resource://pocketchange/PocketChange.js");

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
  
  init : function(e) {
    window.alert("PocketChangeChrome initialized");
    jQuery.noConflict();    

    window.addEventListener("dblclick", function(e) { PocketChangeChrome.BrowserOverlay.handleClicks(e); }, false);
  },

  handleClicks : function(e) {
    
    var pcConsole = Components.utils.reportError;
    /*
    jQuery.each(location, function(key, element) {
        dump('key: ' + key + '\n' + 'value: ' + element);
    });
    */
    dump(location.href);

    // check what was clicked
    // check what page it is
    // handle it

    //PocketChangeChrome.BrowserOverlay.openForm();
  },

  openForm : function() {
    window.open(
      "chrome://pocketchange/content/form.xul"
      ,"pcForm"
      ,"chrome,width=300,height=600"
    );
  },

  /**
   * Says 'Hello' to the user.
   */
  sayHello : function(aEvent) {    
    let message;

    PocketChange.Fubar.changeString("fubar101");
    message = PocketChange.Fubar.rhString;    

    window.alert(message);
  }
};


//window.addEventListener("load", function(e) { PocketChangeChrome.BrowserOverlay.sayHello(e); }, false);
window.addEventListener("load", function(e) { PocketChangeChrome.BrowserOverlay.init(e); }, false);