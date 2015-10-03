Tracker.autorun(function() {

    var userId = Meteor.userId();
    console.log(userId);

    if (!userId){
        Router.go('home');
        return;
    }

    var userProfile = PersonProfiles.findOne({owner:Meteor.userId()});

    if (userProfile) {
        Session.set('canCalibrate', true);
        console.log('set session variable canCalibrate to true');
        return;
    }

    var vowelCalibrations = CardinalVowels.findOne({owner: Meteor.userId()});

    if (vowelCalibrations) {
        Session.set('canVowelTrain', true);

        return;
    }

    var sentences = Sentences.findOne({owner: Meteor.userId()});

    if (sentences) {
        Session.set('canViewProgress', true);
        return;
    }

});