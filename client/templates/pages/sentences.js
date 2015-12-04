var sentences;

Template.sentences.onRendered(function () {
    console.log("SentenceID: " + this.sentenceId);
    Session.set("currentRecording", undefined);
    //sentences = Sentences.findOne({number:this});
});


Template.sentences.helpers({
    getCurrRecording: function () {
        return Session.get("currentRecording");
    },
    getSentence: function () {
        return Sentences.findOne({number: this.sentenceId}).text;
    },
    debug: function () {
        console.log("this context " + JSON.stringify(this));
        console.log("this sentence ID: " + this.sentenceId);

    }
});

Template.sentences.events({
    "click .js-nextStep": function (ev) {
        console.log("Current Sentence " + sentences.text);

        Meteor.call("saveSentenceSample", this.sentenceId, Session.get("currentRecording"));
        Session.set("currentRecording", undefined);

        if (Number(this.sentenceId) + 1 < sentences.length)
            Router.go("/sentences/" + (Number(this.sentenceId) + 1));
        else
            Router.go("/");

    }
});