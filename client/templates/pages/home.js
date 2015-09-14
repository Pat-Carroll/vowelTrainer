
var buttonMessage = "";

Template.home.onCreated(function(){

	var myUserProfile = PersonProfiles.findOne({owner:Meteor.userId()});
});


Template.home.onRendered (function () {

	var myUserProfile = PersonProfiles.findOne({owner:Meteor.userId()});

	if (myUserProfile) {
		$('.btn.calibrate').prop('disabled', false);
		buttonMessage = "Please setup user info first";
	}


	if (CardinalVowels.findOne({owner: Meteor.userId()}) != null) {
		$('.btn.sentences').prop('disabled', false);
		buttonMessage = "Please calibrate the system";
	}


	if (Sentences.findOne({owner: Meteor.userId()}) != null) {
		$('.btn.progress').prop('disabled', false);
		buttonMessage = "Please record a sentence before viewing progress";
	}


});


Template.home.helpers ({


	'displayButtonMessage': function(){
		if ($('.btn.calibrate').prop('disabled') == true) {
			console.log($('.btn.calibrate').prop('disabled'));
			flash("Please setup user info first");
		}
	}



});

Template.home.events ({
	'click .btn.setup': function (event) {
		event.preventDefault();
		Router.go('setup');
	},

	'click .btn.calibrate': function (event) {
		event.preventDefault();
		Router.go('calibrate');
	},

	'click .btn.sentences': function (event) {
		event.preventDefault();
		Router.go('sentences');
	},

	'click .btn.progress': function (event) {
		event.preventDefault();
		Router.go('progress');
	},

});