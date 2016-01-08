// Maybe need to initialize a reactive variable with reactive var package to keep track of when a sentence is avaiable
// http://stackoverflow.com/questions/27304409/meteor-js-how-to-call-helper-method-from-event

Template.sentence_trainer.onRendered(function () {
    Session.set("currentRecording", undefined);

});


Template.sentence_trainer.helpers({
    getCurrRecording: function () {
        return Session.get("currentRecording");
    },
    getSentence: function () {
        return Sentences.findOne({number: this.sentenceId}).text;
    },
    debug: function () {
        console.log("this context " + JSON.stringify(this));
        console.log("this sentence ID: " + this.sentenceId);

    },
    hasPreviousSentence: function() {
        return this.sentenceId > 8;
    },
    hasNextSentence: function() {
        return this.sentenceId + 1 < Sentences.find().count();
    },
    // TODO when user returns to the sentences page, start on the last incompleted sentence

    sentenceRendered: function() {
        //TODO check if the users has first submitted the current sentence to be rendered
        // this will be used with has Next Sentence in order to check if they can move on to the next sentence.
        return true;
    }
});

Template.sentence_trainer.events({

    "click .js-prevStep": function (ev) {
        ev.preventDefault();
        Session.set("currentRecording", undefined);
        Router.go("/sentence_trainer/" + Number(this.sentenceId - 1));

    },

    "click .submitSentence": function (ev) {
        ev.preventDefault();

        console.log("Saved Sentence " + Sentences.findOne({number: this.sentenceId}).text);

        // TODO include some return value in the saveSampleSentence to show success or failure
        Meteor.call("saveSentenceSample", this.sentenceId, Session.get("currentRecording"),SentenceProductionsTypes.training);

        Session.set("currentRecording", undefined);

    },
    "click .js-nextStep": function (ev) {
        ev.preventDefault();
        Session.set("currentRecording", undefined);
        Router.go("/sentence_trainer/" + Number(this.sentenceId + 1));

    },

    "click .home": function (ev) {
        ev.preventDefault();

        Router.go("/");

    }

});