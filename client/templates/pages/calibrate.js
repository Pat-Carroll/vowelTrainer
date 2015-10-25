var recordings = [];

Template.calibrate.helpers({
    getCurrRecording: function(){
        return Session.get("currentRecording");
    },

});

Template.calibrate.events({
   "click .js-nextStep": function(ev){
       console.log("Current Vowel " + this.vowel);
        switch (this.vowel){
            case "i":
                Meteor.call("saveCalibrationVowel",this.vowel, Session.get("currentRecording"));
                Session.set("currentRecording",undefined);
                Router.go("/calibrate/u");
                break;
            case "u":
                Meteor.call("saveCalibrationVowel",this.vowel, Session.get("currentRecording"));
                Session.set("currentRecording",undefined);
                Router.go("/");
                break;
            case "a":
                Meteor.call("saveCalibrationVowel",this.vowel, Session.get("currentRecording"));
                Session.set("currentRecording",undefined);
                Router.go("/calibrate/i");
                break;
            default:
                Session.set("currentRecording",undefined);
                Router.go("/calibrate/a");
        }
    }
});

Template.calibrate.onRendered(function(){
    Session.set("currentRecording",undefined);
});

