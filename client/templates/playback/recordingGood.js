/**
 * Created by patrick on 1/25/16.
 */



Template.recordingGood.helpers({


    userSentences: function (parentContext) {
        var userSentences = SentenceProductions.find({
            owner: Meteor.userId(),
            sentenceId: parentContext.sentenceId
        });

        return userSentences;
    },


});