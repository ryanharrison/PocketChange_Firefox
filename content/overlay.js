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

    // Check the "Enabled" menuitem if applicable
    PocketChange.ButtonController.updateEnableCheck();
    // Display the enabled/disabled button image
    PocketChange.ButtonController.updateImage();

    // Add click handlers    
    window.addEventListener("DOMContentLoaded", function(e) { 
      PocketChangeChrome.BrowserOverlay.scanPages(e); 
    }, false);

    // // Attach handler to double clicks to open form
    // jQuery(window).dblclick(function(){
    //   // Check if PocketChange is enabled
    //   if (PocketChange.Helper.isEnabled()) {
    //     PocketChangeChrome.BrowserOverlay.handleClicks(e);
    //   }
    // });

  },

  scanPages : function() {
    var tabs, wm, browserEnumerator;
    tabs = gBrowser.tabs;

    wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]  
                     .getService(Components.interfaces.nsIWindowMediator);  
    browserEnumerator = wm.getEnumerator("navigator:browser");  
  
  // Check each browser instance for Amazon
  while (browserEnumerator.hasMoreElements()) {  
    var browserWin, tabbrowser, numTabs;
    
    browserWin = browserEnumerator.getNext();  
    tabbrowser = browserWin.gBrowser;  
  
    // Check each tab of this browser instance  
    numTabs = tabbrowser.browsers.length;
    
    for (var index = 0; index < numTabs; index++) {
      var currentBrowser;

      currentBrowser = tabbrowser.getBrowserAtIndex(index);
      // Check if this tab is on the Amazon checkout page
      if (PocketChange.Helper.isAmazon(currentBrowser.currentURI.spec)) {        
        PocketChangeChrome.BrowserOverlay.addClickHandler(currentBrowser);
      }

    }
  }

  },

  addClickHandler : function(currentBrowser) {

    jQuery(window.content.document).mousedown(function(e){
      // Check if the Place Order button was clicked
      if (PocketChange.Helper.isOrderButton(e) && !PocketChange.Helper.isFormOpen()) {
        var orderAmt;

        // Get order amount
        orderAmt = PocketChangeChrome.BrowserOverlay.getOrderAmt();
        // Set order amount
        PocketChange.FormController.orderAmount(orderAmt);
        // Open donation form
        PocketChangeChrome.BrowserOverlay.openForm();
      }

    });

  },

  getOrderAmt : function() {    
    var orderAmt;
    orderAmt = jQuery(window.content.document).contents().find("em.price").text();
    return orderAmt;
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