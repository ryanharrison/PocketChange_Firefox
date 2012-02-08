// is this necessary? i don't think so


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
    jQuery.noConflict();
    Components.utils.import("resource://pocketchange/PocketChange.js");

    window.addEventListener("dblclick", function(e) { PocketChangeChrome.BrowserOverlay.handleClicks(e); }, false);
  },

  handleClicks : function(e) {
    
    var pcConsole = Components.utils.reportError;

    var win = window.content;
    //var inputTest = jQuery(win.document.getElementById("album_name")).val();
    var localOrderAmount = jQuery(win.document).contents().find("em.price").text();
    //localOrderAmount = parseFloat(localOrderAmount);
    
    PocketChange.FormController.orderAmount(localOrderAmount);

    /*
    jQuery.each(location, function(key, element) {
        dump('key: ' + key + '\n' + 'value: ' + element);
    });
    */
    //dump(location.href);

    // check what was clicked
    // check what page it is
    // handle it

    PocketChangeChrome.BrowserOverlay.openForm();
  },

  openForm : function() {
    var formWidth;
    formWidth = PocketChange.FormController.width();
    window.open(
      "chrome://pocketchange/content/form.xul"
      ,"pcForm"
      ,"chrome,width="+formWidth+",height=600"
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