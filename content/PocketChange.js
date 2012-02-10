var EXPORTED_SYMBOLS = [ "PocketChange" ];

//const Cc = Components.classes;
//const Ci = Components.interfaces;	

Components.utils.import("resource://gre/modules/NetUtil.jsm");  
Components.utils.import("resource://gre/modules/FileUtils.jsm"); 


if ("undefined" == typeof(PocketChange)) {
  var PocketChange = {};  
};

PocketChange.Settings = {
	
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
		//alert("main toolbar button clicked!");
		PocketChange.Settings.saveSettings();
	}
}

PocketChange.FormController = {
	_formWidth : 300,	// Width in pixels
	_formHeader : 'PocketChange',
	_orderAmount : 57.77,
	_donationRate : 0.03,
	// _APIKEY : "DONORSCHOOSE",
	_APIKEY : "mvu94jd8bucx",
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
	donationRate : function(newDonationRate) {
		if ("undefined" == typeof(newDonationRate)) {
			return this._donationRate;
		} else {
			this._donationRate = newDonationRate;
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