//var pcConsole = Components.utils.reportError;
//pcConsole('can haz debug?');

if ("undefined" == typeof(PocketChangeChrome)) {
	var PocketChangeChrome = {};
};

PocketChangeChrome.FormOverlay = {
	init : function(e) {		

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
				max : PocketChange.FormController.maxProjects(),
				//'showSynopsis' : true,
				//'subject1' : "12"
				//keywords : "Sports"
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
				dump("project AJAX request: success\n");
				jQuery.each(data, function(key, element) {
					dump(key + " : " + element);
					dump("\n");
				});
							
				
				PocketChangeChrome.FormOverlay.appendProjects(data.proposals);				
				PocketChangeChrome.FormOverlay.changeProject();
			}
		});
	},	

	appendProjects : function(projects) {
		var projectList,projectPopup, projectTitle;

		// Initialize menulist		
		$projectList = jQuery("<menulist>").attr({
			id: "project-list",
			oncommand : 'PocketChangeChrome.FormOverlay.changeProject()'			
		});

		$projectPopup = jQuery("<menupopup>");

		jQuery.each(projects, function(key, curProject) {

			var $newProject;

			// Update PocketChange.js
			PocketChange.ProjectsController.addProject(curProject);

			if ( key == 0 ) {				
				PocketChange.ProjectsController.selectedProject(curProject);
			}

			// Format project title
			projectTitle = PocketChangeChrome.FormOverlay.html_entity_decode(curProject.title);			

			// Build project
			$newProject = jQuery("<menuitem>").attr({				
				label : projectTitle,
				value : curProject.id,
				class : 'project-item',
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
	
	changeProject : function() {		
		// Get the ID of the selected project
		var newProjectId = jQuery(".project-item:selected").val();

		// Update PocketChange.ProjectsController with new project
		PocketChange.ProjectsController.selectedProject(PocketChange.ProjectsController.getProjectById(newProjectId));

		dump(PocketChange.ProjectsController.selectedProject().shortDescription + "\n\n");

		// Update form
		PocketChangeChrome.FormOverlay.updateSubject();
		PocketChangeChrome.FormOverlay.updateSchool();
		PocketChangeChrome.FormOverlay.updatePoverty();
		PocketChangeChrome.FormOverlay.updateResource();
		PocketChangeChrome.FormOverlay.updateProgress();
		PocketChangeChrome.FormOverlay.updateDescription();
		PocketChangeChrome.FormOverlay.updateLink();
	},

	updateDescription : function() {
		var $description, descriptionText;
		$description = jQuery("<description>").attr({
			id : 'project-description',			
			width : PocketChange.FormController.width() + "px"
		});

		descriptionText = PocketChange.ProjectsController.selectedProject().shortDescription;
		$description.append( descriptionText );

		// Remove any previous descriptions
		jQuery("#project-description").remove();

		// Update with new description
		jQuery("#description-container").append( $description );
	},

	updateProgress : function() {
		var $progress, totalCost, costToComplete, raised, progressText;
		$progress = jQuery("<description>").attr({
			id : 'project-progress',			
			width : PocketChange.FormController.width() + "px"
		});

		totalCost = PocketChange.ProjectsController.selectedProject().totalPrice;
		costToComplete = PocketChange.ProjectsController.selectedProject().costToComplete;
		raised =  totalCost - costToComplete;

		progressText = "$" + raised + " of $" + totalCost + " raised. $" + costToComplete + " left to go.";
		$progress.append( progressText );

		// Remove any previous progress text
		jQuery("#project-progress").remove();

		// Update with new progress
		jQuery("#progress-container").append( $progress );	
	},

	updateSchool : function() {
		var $school, schoolName, schoolText;
		$school = jQuery("<description>").attr({
			id : 'project-school',			
			width : PocketChange.FormController.width() + "px"
		});

		if ( "undefined" == typeof(PocketChange.ProjectsController.selectedProject().schoolName) ) {
			schoolName = "school name hidden";
		} else {
			schoolName = PocketChange.ProjectsController.selectedProject().schoolName;			
		}

		schoolText = "School: " + schoolName;
		$school.append( schoolText );

		// Remove any previous school text
		jQuery("#project-school").remove();

		// Update with new school
		jQuery("#school-container").append( $school );
	},

	updateSubject : function() {
		var $subject, subjectName, subjectText;
		$subject = jQuery("<description>").attr({
			id : 'project-subject',
			width : PocketChange.FormController.width() + "px"
		});
		
		subjectName = PocketChange.ProjectsController.selectedProject().subject.name;

		subjectText = "Subject: " + subjectName;
		$subject.append( subjectText );

		// Remove any previous subject text
		jQuery("#project-subject").remove();

		// Update with new subject
		jQuery("#subject-container").append( $subject );
	},

	updatePoverty : function() {
		var $poverty, povertyLevel, povertyText;
		$poverty = jQuery("<description>").attr({
			id : 'project-poverty',
			width : PocketChange.FormController.width() + "px"
		});
		
		povertyLevel = PocketChange.ProjectsController.selectedProject().povertyLevel;

		povertyText = "Poverty Level: " + povertyLevel;
		$poverty.append( povertyText );

		// Remove any previous subject text
		jQuery("#project-poverty").remove();

		// Update with new subject
		jQuery("#poverty-container").append( $poverty );
	},

	updateResource : function() {
		var $resource, resourceType, resourceText;
		$resource = jQuery("<description>").attr({
			id : 'project-resource',
			width : PocketChange.FormController.width() + "px"
		});
		
		resourceType = PocketChange.ProjectsController.selectedProject().resource.name;

		resourceText = "Resource Type: " + resourceType;
		$resource.append( resourceText );

		// Remove any previous subject text
		jQuery("#project-resource").remove();

		// Update with new subject
		jQuery("#resource-container").append( $resource );
	},

	updateLink : function() {
		var $link, proposalLink;		
		proposalLink = PocketChange.ProjectsController.selectedProject().proposalURL;		
		proposalLink = PocketChangeChrome.FormOverlay.html_entity_decode(proposalLink);		

		$link = jQuery("<label>").attr({
			id : 'project-link',			
			width : PocketChange.FormController.width() + "px",
			class : 'text-link',
			href : proposalLink,
			value : 'View Project'
		});

		// Remove any previous subject text
		jQuery("#project-link").remove();

		// Update with new subject
		jQuery("#link-container").append( $link );
		//document.getElementById('project-link').textContent = proposalLink;
	},

	html_entity_decode : function(str) {		
		str = str.replace(/&amp;/g,"&");
		str = str.replace(/&#039;/g,"'");		
		return str;		
	}

};



window.addEventListener("load", function(e) {
	jQuery.noConflict();
	PocketChangeChrome.FormOverlay.init(e);
}, false);