
Template.home.onCreated(function(){


});


Template.home.onRendered (function () {

});


Template.home.helpers ({

	hasSetup: function() {
		return !!(PersonProfiles.findOne({owner:Meteor.userId()}));
	},
	canCalibrate: function(){
		return Session.get("canCalibrate");
	},
	canVowelTrain: function(){
		return Session.get("canVowelTrain");
	},
	canViewProgress : function(){
		return Session.get("canViewProgress");
	}

});

Template.home.events ({
	'click .button.setup': function (event) {
		event.preventDefault();
		Router.go('/setup');
	},

	'click #calibrate': function (event) {
		event.preventDefault();
		Router.go('/calibrate/a');
	},

	'click #vowelTrainer': function (event) {
		event.preventDefault();
		Router.go('/sentence_trainer/0');
	},

	'click #progress': function (event) {
		event.preventDefault();
		Router.go('/progress');
	},

});