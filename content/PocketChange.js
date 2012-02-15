var EXPORTED_SYMBOLS = [ "PocketChange" ];

//const Cc = Components.classes;
//const Ci = Components.interfaces;	

Components.utils.import("resource://gre/modules/NetUtil.jsm");  
Components.utils.import("resource://gre/modules/FileUtils.jsm"); 


if ("undefined" == typeof(PocketChange)) {
  var PocketChange = {};  
};

PocketChange.Settings = {
	_donationRate : 0.02,

	donationRate : function(rate) {
		if ("undefined" == typeof(rate)) {
			return this._donationRate;
		} else {
			this._donationRate = PocketChange.Settings.formatRate(rate);			
		}
	},
	formatRate : function(rate) {
		var newRate;
		// Convert 5 => 0.05
		newRate = parseFloat(rate)/100;		
		return newRate;
	},
	loadSettings : function() {
		
	},
	saveSettings : function() {
		var filename, data;
		filename = "fubar.txt";
		data = "lolz";
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
			this._filters.zip = zip;
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
			this._filters.subject = newSubject;
		}
	}
}

PocketChange.Helper = {
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