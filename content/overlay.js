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
    PocketChange.Helper.init();

    // Check the "Enabled" menuitem if applicable
    PocketChange.ButtonController.updateEnableCheck();
    // Display the enabled/disabled button image
    PocketChange.ButtonController.updateImage();

    // Attach handler to double clicks to open form
    jQuery(window).dblclick(function(){
      // Check if PocketChange is enabled
      if (PocketChange.Helper.isEnabled()) {
        PocketChangeChrome.BrowserOverlay.handleClicks(e);
      }
    });

  },

  handleClicks : function(e) {
    var cURI, win, localOrderAmount;
    cURI = gBrowser.mCurrentBrowser.currentURI.spec;

    if (PocketChange.Helper.isAmazon(cURI)) {  
      win = window.content;
      localOrderAmount = jQuery(win.document).contents().find("em.price").text();
      //localOrderAmount = parseFloat(localOrderAmount);

      PocketChange.FormController.orderAmount(localOrderAmount);

      PocketChangeChrome.BrowserOverlay.openForm();
    }
    
  },

  openForm : function() {
    var formWidth;
    formWidth = PocketChange.FormController.width();
    window.open(
      "chrome://pocketchange/content/form.xul"
      ,"pcForm"
      ,"chrome,width="+formWidth+",height=600"
    );
  }
  
};

window.addEventListener("load", function(e) { PocketChangeChrome.BrowserOverlay.init(e); }, false);