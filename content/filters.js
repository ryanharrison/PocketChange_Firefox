//var pcConsole = Components.utils.reportError;
//pcConsole('can haz debug?');

if ("undefined" == typeof(PocketChangeChrome)) {
	var PocketChangeChrome = {};
};

PocketChangeChrome.Filters = {	
	init : function() {
		PocketChange.Helper.dump("filters init...");

		//PocketChangeChrome.Filters.updateValues();
	},
	updateValues : function() {
		var donationRate;

		PocketChange.Helper.dump("updateValues");

		donationRate = PocketChange.Settings.donationRate();
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
		PocketChange.Settings.donationRate(rate);
	},
	updateZip : function() {
		var zip;		
		zip = jQuery("#zip-code").val();
		PocketChange.SearchFilters.updateZip(zip);		
	},
	updateSubject : function() {
		var sub, subKey, subVal, subName;

		subKey = jQuery(".subject:selected").attr("subKey");
		subVal = jQuery(".subject:selected").attr("subVal");
		subName = jQuery(".subject:selected").attr("label");

		sub = {
			key : subKey,
			val : subVal,
			name : subName
		};
		
		PocketChange.SearchFilters.updateSubject(sub);
	},
	testFilter : function(filter) {
		var test;

		PocketChange.Helper.dump("testFilter: " + filter);
		test = PocketChange.SearchFilters.get();
		try{
			PocketChange.Helper.dump(test[filter].key + "=" + test[filter].val);
		} catch(error) {
			PocketChange.Helper.dump("TEST FAILED:" + error);
		}
	}
	

};



window.addEventListener("load", function(e) {
	jQuery.noConflict();
	PocketChangeChrome.Filters.init();
}, false);