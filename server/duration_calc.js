/**
 * Created by patrick on 1/24/16.
 */


Meteor.methods({
    caclulateTargetDuration: function () {

        var GermanSpeakers = PersonProfiles.find({motherLang: "Deutsch"});

        var sentences = Sentences.find({number: {$gt:44}});

        sentences.forEach( function(sentence){


            var avg_rel_duration = 0;
            var total_german_speakers = GermanSpeakers.count();

            GermanSpeakers.forEach( function(germanSpeaker){

                var owner = germanSpeaker.owner;

                var lastProduction = SentenceProductions.findOne(
                    {
                        owner: owner,
                        sentenceId: sentence.number,
                    },
                    {sort: {timestamp: -1}}
                );

                if (lastProduction){
                    avg_rel_duration = avg_rel_duration + lastProduction.relative_phone_length;
                }
                else {
                    avg_rel_duration = avg_rel_duration + 0;
                }


            });

            avg_rel_duration = avg_rel_duration / total_german_speakers;

            Sentences.update({number: sentence.number}, {$set: {target_duration: avg_rel_duration }});
        });
    }

});