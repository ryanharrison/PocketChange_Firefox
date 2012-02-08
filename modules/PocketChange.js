var EXPORTED_SYMBOLS = [ "PocketChange" ];

//const Cc = Components.classes;
//const Ci = Components.interfaces;	


if ("undefined" == typeof(PocketChange)) {
  var PocketChange = {};  
};

// PocketChange.Settings = {
// 	_rhString : 'fubar string',

// 	get rhString() { return this._rhString; },

// 	changeString : function(newString) {
// 		this._rhString = newString;
// 	}
// }

PocketChange.ButtonController = {
	testing : function() {
		window.alert("toolbar button clicked!");
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