var recordings = [];

Template.calibrate.helpers({
    getCurrRecording: function(){
        return Session.get("currentRecording");
    },

});

Template.calibrate.events({
   "click .js-nextStep": function(currVowel){
        switch (currVowel){
            case "i":
                Router.go("/calibrate/u");
                break;
            case "u":
                Router.go("/");
                break;
            default:
                Router.go("/calibrate/i");
        }
    }
})

