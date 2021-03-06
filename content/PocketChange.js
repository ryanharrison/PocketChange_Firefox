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
		var pcPrefs, data;
		// Instantiate the wrapper
		pcPrefs = new PrefsWrapper1("extensions.pocketchange.");

		data = {};
		data.key = prefKey;

		if (type == "boolean") {
			try {
				data.pref = pcPrefs.getBoolPref(prefKey);				
				data.hasPref = true;
			} catch(err) {
				data.hasPref = false;
			}
		} else if (type == "string") {
			try {
				data.pref = pcPrefs.getCharPref(prefKey);
				data.hasPref = true;
			} catch(err) {
				data.hasPref = false;
			}
		} else if (type == "int") {
			try {
				data.pref = pcPrefs.getIntPref(prefKey);
				data.hasPref = true;
			} catch(err) {
				data.hasPref = false;
			}
		}

		return data;
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
			var pref;
			pref = PocketChange.Prefs.get("taxReminder", "boolean");
			
			if (pref.hasPref) {
				return pref.pref;
			} else {
				alert("Pref not found: taxReminder");
			}

			
		} else {
			// Set new value
			PocketChange.Prefs.set("taxReminder", status, "boolean");
		}
	},
	donationRate : function(rate) {
		if ("undefined" == typeof(rate)) {			
			var pref;
			pref = PocketChange.Prefs.get("donationRate", "int");

			if (pref.hasPref) {
				return pref.pref;
			} else {
				alert("Pref not found: donationRate");
			}

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
		// This is fired when any part of the toolbar button is clicked
	},	
	enable : function() {
		if (PocketChange.Helper.isEnabled()) {
			// Disable
			PocketChange.Prefs.set("enabled", false, "boolean");			
		} else {
			// Enable
			PocketChange.Prefs.set("enabled", true, "boolean");
		}
		
		PocketChangeChrome.BrowserOverlay.init();
		//PocketChange.ButtonController.updateEnableCheck();
		//PocketChange.ButtonController.updateImage();
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
		if (option == "dashboard") {
			PocketChange.Helper.openTab("chrome://pocketchange/content/dashboard.xul");
		} else if (option == "analytics") {
			PocketChange.Helper.openTab("chrome://pocketchange/content/analytics.xul");
		} else if (option == "badges") {
			PocketChange.Helper.openTab("chrome://pocketchange/content/badges.xul");
		} else if (option == "options") {
			var features = "chrome,titlebar,toolbar,centerscreen,modal";
			var url = "chrome://pocketchange/content/options.xul";
			window.openDialog(url, "Settings", features);
		}
	}
}

PocketChange.FormController = {
	_formWidth : 600,	// Width in pixels
	_formHeight : 400,	// Height in pixels	
	_APIKEY : "DONORSCHOOSE",	

	width : function(newWidth) {
		if ("undefined" == typeof(newWidth)) {
			return this._formWidth;
		} else {
			this._formWidth = newWidth;
		}
	},
	height : function(newHeight) {
		if ("undefined" == typeof(newHeight)) {
			return this._formHeight;
		} else {
			this._formHeight = newHeight;
		}
	},	
	orderAmount : function(newOrderAmount) {
		if ("undefined" == typeof(newOrderAmount)) {			
			var pref;
			pref = PocketChange.Prefs.get("orderAmt", "string");

			if (pref.hasPref) {
				return pref.pref;
			} else {
				alert("Pref not found: orderAmount");
			}

		} else {			
			PocketChange.Prefs.set("orderAmt", newOrderAmount, "string");
		}
	},
	calculateDonation : function(orderAmt, donationRate) {		
		return ( (donationRate/100) * orderAmt ).toFixed(2);		
	},
	apiKey : function() {		
		return this._APIKEY;
	},
	maxProjects : function() {		
		var pref;
		pref = PocketChange.Prefs.get("maxProjects", "int");

		if (pref.hasPref) {
			return pref.pref;
		} else {
			alert("Pref not found: maxProjects");
		}

	},
	apiData : function() {
		var data, zipPref, subjectPref, povertyPref, subject, toString;
		data = {};		

		// Get prefs
		zipPref = PocketChange.Prefs.get("zipCode", "string");
		subjectPref = PocketChange.Prefs.get("subject", "string");
		povertyPref = PocketChange.Prefs.get("highPoverty", "boolean");

		// Add the API key
		data.APIKey = PocketChange.FormController.apiKey();

		// Set the number of projects to return
		data.max = PocketChange.FormController.maxProjects();

		// Format ZIP code filter
		if (zipPref.hasPref) {
			// Check if it's a valid zip
			if (zipPref.pref.length == 5) {
				//data.keywords = '"' + zipPref.pref +'"';
				data.keywords = zipPref.pref;
			}
		}

		// Format subject filter
		if (subjectPref.hasPref) {
			// Don't add subject filter if set to all subjects
			if (subjectPref.pref != "all") {
				// This converts 'subject1=-1' to 'data.subject1 = -1'
				// Split the subject into key/value
				subject = subjectPref.pref.split("=");			

				// Set key/value
				data[subject[0]] = subject[1];
			}
		}

		// Format high poverty filter
		if (povertyPref.hasPref) {
			// Check if this filter is on
			if (povertyPref.pref) {
				data.highLevelPoverty = "true";
			}
		}

		// Format toString
		toString = "";
		jQuery.each(data, function(key, val) {
			// Fencepost...
			if (toString.length == 0) {
				toString = toString + key + "=" + val;
			} else {
				toString = toString + "&" + key + "=" + val;
			}
		});

		data.toString = function() {
			return toString;
		}
		
		return data;
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

PocketChange.Account = {
	// Temporary info
	_hostname : "http://www.pocketchange.me/",
	_formSubmitURL : "http://www.pocketchange.me/foobar",
	_httprealm : null,
	_usernameField : "email",
	_passwordField : "pass",
	
	storeLogin : function(email, pass) {
		if (email != null && email != "" && pass != null && pass != "" ) {
			var nsLoginInfo, newLoginInfo, oldLoginInfo, loginManager, lastPass;

			loginManager = Components.classes["@mozilla.org/login-manager;1"].  
		                                getService(Components.interfaces.nsILoginManager);
			nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",  
													Components.interfaces.nsILoginInfo,  
													"init"); 
			newLoginInfo = new nsLoginInfo(this._hostname, this._formSubmitURL, this._httprealm, email, pass,  
										this._usernameField, this._passwordField);

			lastPass = PocketChange.Account.getPass();


			if (lastPass.length > 0) {
				// Replace old login with new one
				oldLoginInfo = new nsLoginInfo(this._hostname, this._formSubmitURL, this._httprealm, email, lastPass,  
											this._usernameField, this._passwordField);
				loginManager.modifyLogin(oldLoginInfo, newLoginInfo)

			} else {
				// No login found, add new one
				loginManager.addLogin(newLoginInfo);
			}
		}
	},

	getPass : function() {
		var nsLoginInfo, loginInfo, loginManager, logins, usernameData, username;		
		loginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);

		// Set username to email address
		usernameData = PocketChange.Prefs.get("email","string");

		// Check if email address is stored
		if (usernameData.hasPref) {

			username = usernameData.pref;

			// Find users for the given parameters
			logins = loginManager.findLogins({}, this._hostname, this._formSubmitURL, this._httprealm);

			// Find user from returned array of nsILoginInfo objects  
			for (var i = 0; i < logins.length; i++) {
				if (logins[i].username == username) {
					return logins[i].password;
				}
			}
			
			// No saved password found for given email
			return "";
		} else {
			// No saved password found
			PocketChange.Helper.dump("no pass found");
			return "";
		}
	}
}

PocketChange.Helper = {	
	isEnabled : function() {
		var pref;
		pref = PocketChange.Prefs.get("enabled", "boolean");
		
		if (pref.hasPref) {
			return pref.pref;
		} else {
			alert("Pref not found: isEnabled");
		}

	},
	html_entity_decode : function(str) {
		str = str.replace(/&amp;/g,"&");
		str = str.replace(/&#034;/g,'"');
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
		var t1;		
		// If found, t1 is true
		t1 = (url.indexOf("amazon.com") >= 0);		
		return t1;
	},
	isOrderButton : function(e) {
		var expectedName = "placeYourOrder";		
		return (e.target.name == expectedName);
	},
	isFormOpen : function() {  
	    var tabs, wm, browserEnumerator, foundForm;
	    tabs = gBrowser.tabs;

	    wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]  
	                     .getService(Components.interfaces.nsIWindowMediator);  
	    browserEnumerator = wm.getEnumerator("navigator:browser");  
	  
	  	foundForm = false;
		// Check each browser instance for donation form
		while (browserEnumerator.hasMoreElements()) {  
			var browserWin, tabbrowser, numTabs;

			browserWin = browserEnumerator.getNext();  
			tabbrowser = browserWin.gBrowser;  

			// Check each tab of this browser instance  
			numTabs = tabbrowser.browsers.length;

			for (var index = 0; index < numTabs; index++) {
				var currentBrowser;

				currentBrowser = tabbrowser.getBrowserAtIndex(index);
				// This should be changed to
				if (currentBrowser.contentTitle == "PocketChange: Donate") {
					//PocketChange.Helper.dump(currentBrowser.currentURI.spec);					
					foundForm = true;
				}
			}
		}

		return foundForm;
	},
	dump : function(data) {
		dump(data + "\n");
	}
}