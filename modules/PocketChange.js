var EXPORTED_SYMBOLS = [ "PocketChange" ];

//const Cc = Components.classes;
//const Ci = Components.interfaces;	


if ("undefined" == typeof(PocketChange)) {
  var PocketChange = {};
};

PocketChange.Fubar = {
	_rhString : 'fubar string',

	get rhString() { return this._rhString; },

	changeString : function(newString) {
		this._rhString = newString;
	}
}

PocketChange.FormController = {	
	_formHeader : 'PocketChange',
	_orderAmount : 57.77,
	_donationRate : 0.03,
	// _APIKEY : "DONORSCHOOSE",
	_APIKEY : "mvu94jd8bucx",

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

	getProjectById : function(projectID) {
		jQuery.each(_projects, function(key, curProject) {
			if (curProject.id == projectID) {
				return curProject;
			}
		});
	},

	selectedProject : function(project) {
		if ("undefined" == typeof(project)) {
			return this._selectedProject;
		} else {
			this._selectedProject = project;
		}
	}
}