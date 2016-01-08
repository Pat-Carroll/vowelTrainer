var recordings = [];

Template.calibrate.helpers({
    getCurrRecording: function () {
        return Session.get("currentRecording");
    },
    hasValidCalibrationSentence:function(){
        return SentenceProductions.findOne({owner: Meteor.userId(), sentenceId: this.sentenceId});
    },
    getSentence: function () {
        return Sentences.findOne({number: this.sentenceId}).text;
    },

});

Template.calibrate.events({
    "click .submitSentence": function (ev) {
        ev.preventDefault();

        console.log("Saved Sentence " + Sentences.findOne({number: this.sentenceId}).text);

        // TODO include some return value in the saveSampleSentence to show success or failure
        Meteor.call("saveSentenceSample", this.sentenceId, Session.get("currentRecording"), SentenceProductionsTypes.calibration);

        Session.set("currentRecording", undefined);

    },
    "click .js-nextStep": function (ev) {
        if (this.sentenceId < 8)
            Router.go("/calibrate/" + (Number(this.sentenceId) + 1));
        else{
            Meteor.call("calculateCalibration");
            Router.go("/");

        }
            }
});

Template.calibrate.onRendered(function () {
    Session.set("currentRecording", undefined);
});

