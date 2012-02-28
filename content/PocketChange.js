var EXPORTED_SYMBOLS = [ "PocketChange" ];

//const Cc = Components.classes;
//const Ci = Components.interfaces;	

//Components.utils.import("resource://gre/modules/NetUtil.jsm");  
//Components.utils.import("resource://gre/modules/FileUtils.jsm"); 


if ("undefined" == typeof(PocketChange)) {
  var PocketChange = {};  
};

PocketChange.Prefs = {	
	get : function(prefKey, type) {
		var pcPrefs, pref;
		
		// Instantiate the wrapper
		pcPrefs = new PrefsWrapper1("extensions.pocketchange.");

		if (type == "boolean") {
			pref = pcPrefs.getBoolPref(prefKey);
		} else if (type == "string") {
			pref = pcPrefs.getCharPref(prefKey);
		} else if (type == "int") {
			pref = pcPrefs.getIntPref(prefKey);
		}

		return pref;
	},
	set : function(prefKey, prefValue, type) {
		var pcPrefs;		
		
		// Instantiate the wrapper
		pcPrefs = new PrefsWrapper1("extensions.pocketchange.");

		if (type == "boolean") {
			pcPrefs.setBoolPref(prefKey, prefValue);
		} else if (type == "string") {
			pcPrefs.setCharPref(prefKey, prefValue);
		} else if (type == "int") {
			pcPrefs.setIntPref(prefKey, prefValue);
		}
	}
}

PocketChange.Settings = {
	taxReminder : function(status) {
		if ("undefined" == typeof(status)) {
			return PocketChange.Prefs.get("taxReminder", "boolean");
		} else {
			// Set new value
			PocketChange.Prefs.set("taxReminder", status, "boolean");
		}
	},
	donationRate : function(rate) {
		if ("undefined" == typeof(rate)) {			
			return PocketChange.Prefs.get("donationRate", "int");
		} else {
			// Set new value			
			PocketChange.Prefs.set("donationRate", rate, "int");			
		}
	},
	formatRate : function(rate) {
		var newRate;
		// Convert 5 => 0.05
		newRate = parseFloat(rate)/100;
		return newRate;
	}	
}

PocketChange.ButtonController = {
	mainButtonClick : function() {		
		
	},	
	enable : function() {
		if (PocketChange.Helper.isEnabled()) {
			// Disable
			PocketChange.Prefs.set("enabled", false, "boolean");			
		} else {
			// Enable
			PocketChange.Prefs.set("enabled", true, "boolean");			
		}

		PocketChange.ButtonController.updateEnableCheck();
		PocketChange.ButtonController.updateImage();
	},
	updateEnableCheck : function() {
		if (PocketChange.Helper.isEnabled()) {
			jQuery("#enabled-checkbox").attr({
				checked : true
			});
		} else {
			jQuery("#enabled-checkbox").attr({
				checked : false
			});
		}
	},
	updateImage : function() {
		var disabledURL, enabledURL;
		
		disabledURL = "chrome://pocketchange/content/images/button_big_deselected.png";
		enabledURL = "chrome://pocketchange/content/images/button_big.png";

		if (PocketChange.Helper.isEnabled()) {		
			// Show disabled image
			jQuery("#pocketchange-button").css("list-style-image","url('"+enabledURL+"'");
		} else {			
			// Show enabled image
			jQuery("#pocketchange-button").css("list-style-image","url('"+disabledURL+"'");
		}
	},
	pageClick : function(option) {
		if (option == "filters") {
			PocketChange.Helper.openTab("chrome://pocketchange/content/filters.xul");
		} else if (option == "donation-form") {
			PocketChange.Helper.openTab("chrome://pocketchange/content/form.xul");
		}
	}
}

PocketChange.FormController = {
	_formWidth : 300,	// Width in pixels
	_formHeader : 'PocketChange',	
	_APIKEY : "DONORSCHOOSE",	

	width : function(newWidth) {
		if ("undefined" == typeof(newWidth)) {
			return this._formWidth;
		} else {
			this._formWidth = newWidth;
		}
	},	
	header : function(newHeader) {
		if ("undefined" == typeof(newHeader)) {
			return this._formHeader;
		} else {
			this._formHeader = newHeader;
		}
	},		
	orderAmount : function(newOrderAmount) {
		if ("undefined" == typeof(newOrderAmount)) {			
			return PocketChange.Prefs.get("orderAmt", "string");
		} else {			
			PocketChange.Prefs.set("orderAmt", newOrderAmount, "string");
		}
	},	
	apiKey : function() {		
		return this._APIKEY;
	},
	maxProjects : function() {		
		return PocketChange.Prefs.get("maxProjects", "int");
	}

}

PocketChange.ProjectsController = {
	_projects : new Array(),
	_selectedProject : null,

	init : function() {
		return "test";
	},
	addProject : function(newProject) {
		this._projects.push(newProject);
	},
	getProjects : function() {
		return this._projects;
	},
	getProjectById : function(projectId) {		
		for ( var i in this._projects ) {
			var curProject = this._projects[i];

			if ( curProject.id == projectId ) {
				return curProject;
			}
		}		
	},
	selectedProject : function(project) {
		if ("undefined" == typeof(project)) {
			return this._selectedProject;
		} else {
			this._selectedProject = project;
		}
	}
}

PocketChange.FileAccess = {
	saveToFile : function(filename, data) {
		var localDir, file, ostream, converter, istream;

		// Get the directory that the file will be saved in.
		// If the directory does not exist, create it.
		localDir = new FileUtils.getDir("ProfD",["pocketchange"], true, false);

		// Append the filename.
		localDir.append(filename);
		
		// Create a file object to store settings.
		file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);		

		// Inititalize the settings file (create it).
		file.initWithPath(localDir.path);

		ostream = FileUtils.openSafeFileOutputStream(file);
		converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);  
		converter.charset = "UTF-8";

		istream = converter.convertToInputStream(data);
		
		//The last argument (the callback) is optional.		
		NetUtil.asyncCopy(istream, ostream, function(status) {  
			if (!Components.isSuccessCode(status)) {  
				// Handle error!  
				alert('found error');
				PocketChange.Helper.dump("file error:\n"+status);
				return;  
			}
			
			// Data has been written to the file.
		  	alert('Data has been written to the file');
		});
	},
	read : function(filename, callback) {
		var localDir, file, obj;

		// Get the directory that the file will be saved in.
		// If the directory does not exist, create it.
		localDir = new FileUtils.getDir("ProfD",["pocketchange"], true, false);

		// Append the filename.
		localDir.append(filename);
		
		// Create a file object to store settings.
		file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

		// Inititalize the settings file (create it).
		file.initWithPath(localDir.path);
		
		NetUtil.asyncFetch(file, function(inputStream, status) {
			if (!Components.isSuccessCode(status)) {
				// Handle error!
				PocketChange.Helper.dump("READ ERROR");
				return;
			}

			// The file data is contained within inputStream.
			// You can read it into a string with			
			var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
			
			callback(JSON.parse(data));
		});
	}
}

PocketChange.SearchFilters = {
	_filters : {},

	get : function() {
		return this._filters;
	},
	updateZip : function(newZip) {
		if (PocketChange.SearchFilters.validateZip(newZip)) {
			var zip;
			zip = {
				key : "keywords",
				val : newZip
			}
			// Update preferences
			PocketChange.Prefs.set("zipCode", newZip, "int");
			// Set new value
			this._filters.zip = zip;			
		} else {
			PocketChange.Helper.dump("invalid zip: " + newZip + "\n");
		}
	},
	// Tests if the ZIP code is a 5 digit number
	validateZip : function(zip) {
		var zipCodePattern = /^\d{5}$/;
		return zipCodePattern.test(zip);
	},
	updateSubject : function(newSubject) {		
		if (newSubject.key == "all") {
			// Update preferences
			PocketChange.Prefs.set("subjectKey", "all", "string");
			PocketChange.Prefs.set("subjectVal", "all", "string");
			PocketChange.Prefs.set("subjectName", "all", "string");

			this._filters.subject = null;			
		} else {
			// Update preferences
			PocketChange.Prefs.set("subjectKey", newSubject.key, "string");
			PocketChange.Prefs.set("subjectVal", newSubject.val, "string");
			PocketChange.Prefs.set("subjectName", newSubject.name, "string");	
		}
	}
}

PocketChange.Helper = {
	init : function() {		
		
	},
	isEnabled : function() {
		return PocketChange.Prefs.get("enabled", "boolean");
	},
	html_entity_decode : function(str) {
		str = str.replace(/&amp;/g,"&");
		str = str.replace(/&#039;/g,"'");
		return str;
	},
	openTab : function(url) {
		var browser, tab;
		browser = document.getElementById("content");
		tab = browser.addTab(url);
		// Focus the new tab, otherwise it will open in background
		browser.selectedTab = tab;
	},
	isAmazon : function(url) {
		var t1,t2;
		
		// If found, t1 is true
		t1 = (url.indexOf("amazon.com") >= 0);
		// If found, t2 is true
		t2 = (url.indexOf("ref=ox_shipaddress_ship_to_this_3") >= 0);
		
		return (t1 && t2);
	},
	dump : function(data) {		
		dump(data + "\n");
	}
}