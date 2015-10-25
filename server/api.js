Meteor.methods({
    'saveCalibrationVowel': function (vowel, audio) {
        //Todo do some script calling etc.

        //Todo save stuff in userProfile
        var userProfile = PersonProfiles.findOne({owner: Meteor.userId()});
        var sampleId = UserAudio.insert(audio);
        console.log("Vowel: " + vowel + " added for "+userProfile.username+"! " + sampleId._id);
        switch (vowel) {
            case 'a':
                CardinalVowels.update({_id: userProfile.cardinalVowels}, {$set: {sampleFileA: sampleId._id}});
                break;
            case 'i':
                CardinalVowels.update({_id: userProfile.cardinalVowels}, {$set: {sampleFileI: sampleId._id}});
                break;
            case 'u':
                CardinalVowels.update({_id: userProfile.cardinalVowels}, {$set: {sampleFileU: sampleId._id}});
                break;
            default :
                throw new Meteor.Error("Illegal vowel!");
                break;
        }

    },
    'saveSentenceSample': function (sentenceID, audio) {
        //Todo do some script calling etc.

        //Todo save stuff in userProfile
        var userProfile = PersonProfiles.findOne({owner: Meteor.userId()});
        var sampleId = UserAudio.insert(audio);
         //Todo save sentence ref

    }


});