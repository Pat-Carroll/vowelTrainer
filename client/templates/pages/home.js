
var buttonMessage = "";

Template.home.onCreated(function(){

	var myUserProfile = PersonProfiles.findOne({owner:Meteor.userId()});
});


Template.home.onRendered (function () {



	if (Session.get('canCalibrate')) {
		$('.calibrate').prop('disabled', false);
		buttonMessage = "Please calibrate the vowel system";
	}


	if (Session.get('canVowelTrain')) {
		$('.vowelTrainer').prop('disabled', false);
		buttonMessage = "Please try training your pronounciation";
	}


	if (Session.get('canViewProgress')) {
		$('.progress').prop('disabled', false);
		buttonMessage = "You can recalibrate your vowels, train your pronounciation, or view your progress";
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
	'click .button.setup': function (event) {
		event.preventDefault();
		Router.go('setup');
	},

	'click #calibrate': function (event) {
		event.preventDefault();
		Router.go('calibrate');
	},

	'click #vowelTrainer': function (event) {
		event.preventDefault();
		Router.go('sentences');
	},

	'click #progress': function (event) {
		event.preventDefault();
		Router.go('progress');
	},

});