Meteor.methods({
    calculateCalibration: function () {
        var targetVowels = {};

        for (var j = 0; j < 9; j++) {
            var prod = SentenceProductions.findOne({owner: Meteor.userId(), sentenceId: j}, {sort: {timestamp: -1}});
            console.log(prod.phone);

            if(!targetVowels[prod.phone])
                targetVowels[prod.phone] = {total: 0, f1_avg: 0, f2_avg: 0, f3_avg: 0};

            var vowel = targetVowels[prod.phone];
            vowel.f1_avg = (vowel.total * vowel.f1_avg + prod.f1_avg) / (vowel.total+1);
            vowel.f2_avg = (vowel.total * vowel.f2_avg + prod.f2_avg) / (vowel.total+1);
            vowel.f3_avg = (vowel.total * vowel.f3_avg + prod.f3_avg) / (vowel.total+1);
            vowel.total++;






        }
        //TODO calculate other vowels
        PersonProfiles.update({owner: Meteor.userId()}, {
            $set: {
                targetVowels: targetVowels
            }
        })

    }
})