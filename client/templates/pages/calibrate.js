var recordings = [];

Template.calibrate.helpers({
    getCurrRecording: function () {
        return Session.get("currentRecording");
    },

});

Template.calibrate.events({
    "click .js-nextStep": function (ev) {
        console.log("Current Vowel " + this.vowel);

        Meteor.call("saveSentenceSample", this.vowel, Session.get("currentRecording"), SentenceProductionsTypes.calibration);

        Session.set("currentRecording", undefined);
        if (this.vowel < 10)
            Router.go("/calibrate/" + (Number(this.vowel) + 1));
        else
            Router.go("/");
    }
});

Template.calibrate.onRendered(function () {
    Session.set("currentRecording", undefined);
});

