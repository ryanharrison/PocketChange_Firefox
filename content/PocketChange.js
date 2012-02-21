var EXPORTED_SYMBOLS = [ "PocketChange" ];

//const Cc = Components.classes;
//const Ci = Components.interfaces;	

Components.utils.import("resource://gre/modules/NetUtil.jsm");  
Components.utils.import("resource://gre/modules/FileUtils.jsm"); 


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
	_donationRate : 2,		// deprecated, remove later
	_taxReminder : false,	// deprecated, remove later

	taxReminder : function(status) {
		if ("undefined" == typeof(status)) {
			return PocketChange.Prefs.get("taxReminder", "boolean");
		} else {
			// Set new value
			PocketChange.Prefs.set("taxReminder", status, "boolean");
			
			// deprecated, remove later
			// Update settings file
			//PocketChange.Settings.export();
		}
	},
	donationRate : function(rate) {
		if ("undefined" == typeof(rate)) {			
			return PocketChange.Prefs.get("donationRate", "int");
		} else {
			// Set new value			
			PocketChange.Prefs.set("donationRate", rate, "int");
			
			// deprecated, remove later
			// Update settings file
			//PocketChange.Settings.export();
		}
	},
	formatRate : function(rate) {
		var newRate;
		// Convert 5 => 0.05
		newRate = parseFloat(rate)/100;		
		return newRate;
	},
	load : function(prevSettings) {
		dump("settings.load...\n");		
		
		dump("prevSettings:\n");
		dump(JSON.stringify(prevSettings, null, 2));
		dump("\n");
		
		// Update settings
		this._donationRate = prevSettings.donationRate;
		this._taxReminder = prevSettings.taxReminder;

		// Update filters page
		//PocketChangeChrome.Filters.updateValues();
	},
	export : function() {
		var filename, data, obj;
		// Set filename
		filename = "settings.json";		

		// Create settings object
		obj = {
			donationRate : this._donationRate,
			taxReminder : this._taxReminder
		};
		// Convert to JSON
		data = JSON.stringify(obj, null, 2);

		// Save to file
		PocketChange.FileAccess.saveToFile(filename, data);
	}
}

PocketChange.ButtonController = {
	mainButtonClick : function() {
		jQuery("#pocketchange-button").css("list-style-image","url('chrome://pocketchange/content/images/button_big_deselected.png'");		
		
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
	_orderAmount : 57.77,	
	_APIKEY : "DONORSCHOOSE",	
	_maxProjects : 5,

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
			return this._orderAmount;
		} else {
			this._orderAmount = newOrderAmount;
		}
	},	
	apiKey : function() {		
		return this._APIKEY;
	},
	maxProjects : function() {
		return this._maxProjects;
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
				dump("file error:\n"+status+"\n\n");
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
				dump("READ ERROR\n");
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
			// Set new value
			this._filters.zip = zip;
			// Update filters file
			PocketChange.SearchFilters.export();
		} else {
			dump("invalid zip: " + newZip + "\n");
		}
	},
	// Tests if the ZIP code is a 5 digit number
	validateZip : function(zip) {
		var zipCodePattern = /^\d{5}$/;
		return zipCodePattern.test(zip);
	},
	updateSubject : function(newSubject) {
		if (newSubject.key == "all") {
			this._filters.subject = null;
		} else {
			// Set new value
			this._filters.subject = newSubject;
			// Update filters file
			PocketChange.SearchFilters.export();
		}
	},
	export : function() {
		var filename, data, obj;
		// Set filename
		filename = "filters.json";
		
		// Convert to JSON
		data = JSON.stringify(this._filters, null, 2);

		// Save to file
		PocketChange.FileAccess.saveToFile(filename, data);
	}
}

PocketChange.Helper = {
	init : function() {
		dump("init passed...\n");
		
		// Load settings
		PocketChange.FileAccess.read("settings.json", PocketChange.Settings.load);
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
	}
	// dumpObject : function(obj) {
	// 	dump("dumpObject:\n");
	// 	if (obj == null) {
	// 		dump("obj is null...\n");
	// 	} else {
	// 		var depth;
	// 		depth = 0;
	// 		jQuery.each(obj, function(key, val) {
				
	// 		});
	// 	}		

	// }
}