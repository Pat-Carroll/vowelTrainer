var sentences = [
    "This is the first sentence",
    "This is the second sentence",
];
Template.sentences.onRendered(function () {
    console.log("SentenceID: " + this.sentenceId);
    Session.set("currentRecording", undefined);
});


Template.sentences.helpers({
    getCurrRecording: function () {
        return Session.get("currentRecording");
    },
    getSentence: function () {
        return sentences[this.sentenceId];
    }
});

Template.sentences.events({
    "click .js-nextStep": function (ev) {
        console.log("Current Sentence " + this.sentenceId);

        Meteor.call("saveSentenceSample", this.sentenceId, Session.get("currentRecording"));
        Session.set("currentRecording", undefined);

        if (Number(this.sentenceId) + 1 < sentences.length)
            Router.go("/sentences/" + (Number(this.sentenceId) + 1));
        else
            Router.go("/");

    }
});