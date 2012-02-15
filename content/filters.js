//var pcConsole = Components.utils.reportError;
//pcConsole('can haz debug?');

if ("undefined" == typeof(PocketChangeChrome)) {
	var PocketChangeChrome = {};
};

PocketChangeChrome.Filters = {	
	updateTaxReminder : function() {
		var status;
		status = jQuery("#tax-reminder").attr("checked");
		
		PocketChange.Settings.taxReminder(status);
	},
	updateDonationRate : function() {
		var rate;

		rate = jQuery("#donation-rate").val();
		PocketChange.Settings.donationRate(rate);
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
	
}, false);