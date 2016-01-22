/**
 * Created by patrick on 1/9/16.
 */

var sentId;

Template.germanSamples.onRendered(function () {


});


Template.germanSamples.helpers({


    germanUsers: function(sent_id){
        var germanUsers = PersonProfiles.find({
            motherLang: "Deutsch"
        });
        console.log(germanUsers.fetch());
        sentId = sent_id;
        return germanUsers;
    },

    getUserName: function(germanUser){
        var name = germanUser.username;
        console.log("user name ", name);
        return name;
    },

    getAudioId: function (parentContext, owner) {

        console.log(parentContext.sent_id);
        console.log(owner);
        var sampleProduction = SentenceProductions.findOne(
            {
                owner: owner,
                sentenceId: parentContext.sent_id,
            },
            {sort: {timestamp: -1}}
        );

        return sampleProduction.recordingId;
    },

    getGermanAudio: function(parentContext, owner){

        console.log(parentContext.sent_id);
        console.log(owner);
        var sampleProduction = SentenceProductions.findOne(
            {
                owner: owner,
                sentenceId: parentContext.sent_id,
            },
            {sort: {timestamp: -1}}
        );
        console.log(sampleProduction);

        var audioFile = UserAudio.findOne({_id: sampleProduction.recordingId});
        var url = audioFile.url();

        return url;
    },


});

Template.germanSamples.events({
   'click .GermanSample' : function (ev){

       var audioId= $(ev.target)[0].id;

       var au = $('#GermanAudio');
       var audioFile = UserAudio.findOne({_id: audioId});
       var url = audioFile.url();
       au.attr('src', url);
       au[0].play();

   }

});