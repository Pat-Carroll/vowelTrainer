Tracker.autorun(function() {

    var userId = Meteor.userId();
    console.log(userId);

    if (!userId){
        Router.go('home');
        Session.keys = {};
        return;
    }

    var userProfile = PersonProfiles.findOne({owner:Meteor.userId()});

    if (!userProfile) {
        Router.go('/');
        return;
    }else{
        Session.set('canCalibrate', true);
        //console.log('set session variable canCalibrate to true');
    }


    if (userProfile.targetVowels) {
        Session.set('canVowelTrain', true);
    } else
    {
        return;
    }

    var sentences = SentenceProductions.findOne({owner: Meteor.userId(), type:SentenceProductionsTypes.training});
    //Todo count sentences ;)
    if (sentences) {
        Session.set('canViewProgress', true);
        return;
    }
//TODO rework tracker now that there are two different representations of sentences.
});