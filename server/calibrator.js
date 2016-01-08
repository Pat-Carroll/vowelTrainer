Meteor.methods({
    calculateCalibration: function () {
        var targetVowels = {};

        for (var j = 0; j < 9; j++) {
            var prod = SentenceProductions.findOne({owner: Meteor.userId(), sentenceId: j}, {sort: {timestamp: -1}});
            console.log(prod.phone);

            if(!targetVowels[prod.phone])
                targetVowels[prod.phone] = {total: 0, f1_avg: 0, f2_avg: 0, f3_avg: 0};

           var a = targetVowels[prod.phone];
                    a.f1_avg = (a.total * a.f1_avg + prod.f1_avg) / (a.total+1);
                    a.f2_avg = (a.total * a.f2_avg + prod.f2_avg) / (a.total+1);
                    a.f3_avg = (a.total * a.f3_avg + prod.f3_avg) / (a.total+1);
                    a.total++;

        }
        //TODO calculate other vowels
        PersonProfiles.update({owner: Meteor.userId()}, {
            $set: {
                targetVowels: targetVowels
            }
        })

    }
})