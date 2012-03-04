/**
 * PocketChangeChrome namespace.
 */
if ("undefined" == typeof(PocketChangeChrome)) {
  var PocketChangeChrome = {};
};


/**
 * Controls the browser overlay for the PocketChange extension.
 */
PocketChangeChrome.OptionsOverlay = {
  
  init : function(e) {    
    jQuery.noConflict();    
    // Fill in password box

    PocketChangeChrome.OptionsOverlay.addPass();
  },

  addPass : function() {
    var pass;

    pass = PocketChange.Account.getPass();    
    // Set password field
    jQuery("#password").val(pass);
  },

  storeLogin : function() {
    var email, pass;

    email = jQuery("#email").val();
    pass = jQuery("#password").val();
    
    PocketChange.Account.storeLogin(email, pass);
  }
  
};

window.addEventListener("load", function(e) { PocketChangeChrome.OptionsOverlay.init(e); }, false);