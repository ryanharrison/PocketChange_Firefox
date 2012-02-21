//var pcConsole = Components.utils.reportError;
//pcConsole('can haz debug?');

if ("undefined" == typeof(PocketChangeChrome)) {
	var PocketChangeChrome = {};
};

PocketChangeChrome.Filters = {	
	init : function() {
		dump("filters init...\n");

		

		// call nsIPrefBranch methods
		var taxes = PocketChange.Prefs.get("taxes", "boolean");
		var name = PocketChange.Prefs.get("name", "string");
		var fubar = PocketChange.Prefs.get("fubar", "int");

		if (taxes) {
			dump("taxes: true\n");
			dump("name : " + name + "\n");
			dump("fubar: " + fubar + "\n");			
		} else {
			dump("taxes: false\n");
		}


		//PocketChangeChrome.Filters.updateValues();
	},
	updateValues : function() {
		var donationRate;

		dump("updateValues\n");

		donationRate = PocketChange.Settings.donationRate(true);
		donationRate = donationRate;


		// Set tax reminder checkbox
		jQuery("#tax-reminder").attr({
			checked : true
		});

		// Set donation rate
		// jQuery("#donation-rate").attr({
		// 	value : donationRate
		// });

		jQuery("#donation-rate").val(donationRate);
	},
	updateTaxReminder : function() {
		var status;
		status = jQuery("#tax-reminder").attr("checked");
		
		PocketChange.Settings.taxReminder(status);		
	},
	updateDonationRate : function() {
		var rate;

		rate = jQuery("#donation-rate").val();
		PocketChange.Settings.donationRate(false, rate);
	},
	updateZip : function() {
		var zip;		
		zip = jQuery("#zip-code").val();
		PocketChange.SearchFilters.updateZip(zip);
		//PocketChangeChrome.Filters.testFilter("zip");
	},
	updateSubject : function() {
		var sub, subKey, subVal;

		subKey = jQuery(".subject:selected").attr("subKey");
		subVal = jQuery(".subject:selected").attr("subVal");

		sub = {
			key : subKey,
			val : subVal
		};
		
		PocketChange.SearchFilters.updateSubject(sub);
		
		//PocketChangeChrome.Filters.testFilter("subject");
	},
	testFilter : function(filter) {
		var test;

		dump("testFilter: " + filter + "\n");
		test = PocketChange.SearchFilters.get();
		try{
			dump(test[filter].key + "=" + test[filter].val + "\n\n");
		} catch(error) {
			dump("TEST FAILED:" + error + "\n");
		}
	}
	

};



window.addEventListener("load", function(e) {
	jQuery.noConflict();
	PocketChangeChrome.Filters.init();
}, false);