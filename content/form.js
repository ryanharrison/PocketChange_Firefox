//var pcConsole = Components.utils.reportError;
//pcConsole('can haz debug?');

if ("undefined" == typeof(PocketChangeChrome)) {
	var PocketChangeChrome = {};
};

PocketChangeChrome.FormOverlay = {
	init : function(e) {
		Components.utils.import("resource://pocketchange/PocketChange.js");

		PocketChangeChrome.FormOverlay.fillForm();
	},

	fillForm : function() {
		// Set order amount
		jQuery("#order-amount").val(
			PocketChange.FormController.orderAmount()
		);

		// Set donation rate
		jQuery("#donation-rate").val(
			PocketChange.FormController.donationRate()
		);

		PocketChangeChrome.FormOverlay.getProjects();
	},

	getProjects : function() {	
		jQuery.ajax({
			type: 'GET',
			url: 'http://api.donorschoose.org/common/json_feed.html',
			data: {
				APIKey : PocketChange.FormController.apiKey(),
				//'showSynopsis' : true,
				//'subject1' : "12"
				keywords : "Music"
			},
			dataType: 'json',
			error: function(a,b,c){
				alert('ERROR: AJAX call failed (getProjects), check console.');
				dump("getProjects AJAX fail\n");
				dump(a,b,c);
				dump("\n");
			},
			success: function(data){
				dump("success\n");
				jQuery.each(data, function(key, element) {
					dump(key + " : " + element);
					dump("\n");
				});

				dump("\n\n");
				dump("data.proposals:\n");
				
				// jQuery.each(data.proposals, function(key, element) {					
				// 	PocketChangeChrome.FormOverlay.appendProject(element, (key == 0));
				// });


				dump("\n\n");
				dump("appendProjects:\n");				
				
				PocketChangeChrome.FormOverlay.appendProjects(data.proposals);
				PocketChangeChrome.FormOverlay.updateDescription();				
			}
		});
	},

	appendProjects : function(projects) {
		var projectList,projectPopup;

		// Initialize menulist
		$projectList = jQuery("<menulist>").attr({
			id: "project-list"
		});
		$projectPopup = jQuery("<menupopup>").change(function(){
			alert('change');
			dump("selected label: ");
			dump(jQuery("menuitem:selected").attr("label"));
			dump("\n");
		});
		$projectPopup.attr({
			oncommand : function(){
				alert('change');
				dump("selected label: ");
				dump(jQuery("menuitem:selected").attr("label"));
				dump("\n");	
			}
		})

		jQuery.each(projects, function(key, curProject) {
			dump(key + " : " + curProject.title);
			dump("\n");

			var $newProject;

			// Update PocketChange.js
			PocketChange.ProjectsController.addProject(curProject);

			if ( key == 0 ) {				
				PocketChange.ProjectsController.selectedProject(curProject);
			}

			// Build project
			$newProject = jQuery("<menuitem>").attr({
				label : curProject.title,
				value : curProject.id,
				tooltiptext : curProject.fulfillmentTrailer,
				selected : (key == 0)
			});

			// Add project to popup
			$projectPopup.append($newProject);
		});
		
		// Add popup to menulist
		$projectList.append($projectPopup);
		// Remove any previous lists
		jQuery("#project-list").remove();
		// Add menu list to form
		jQuery("#project-title-container").append($projectList);
	},	

	updateDescription : function() {
		var $description;
		$description = jQuery("<description>").attr({
			id : 'project-description',			
		}).text( PocketChange.ProjectsController.selectedProject().shortDescription );

		// Remove any previous descriptions
		jQuery("#project-description").remove();
		// Update with new description
		jQuery("#description-container").append($description);
	}

};




window.addEventListener("load", function(e) {
	jQuery.noConflict();
	PocketChangeChrome.FormOverlay.init(e);
}, false);
