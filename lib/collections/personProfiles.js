/**
 * Created by patrick on 1{type: Number}/3/15.
 */

PersonProfiles = new Meteor.Collection(
    'personProfiles',
    {
        owner: {type: String},  //use the Meteor.userId()
        userName: {type: String},
        motherLang: {type: String},
        gender: {type: String},
        profilePic: {type: String},
        age: {type: Date},
        vis_accoustic: {type: String},
        vis_duration: {type: String},
        sentenceProductions: {type: String}, //reference to cardVowels
        targetVowels: {
            "a:": {
                total: {type: Number},
                f1_avg: {type: Number},
                f2_avg: {type: Number},
                f3_avg: {type: Number}
            },
            "i:": {
                total: {type: Number},
                f1_avg: {type: Number},
                f2_avg: {type: Number},
                f3_avg: {type: Number}
            },
            "u:": {
                total: {type: Number},
                f1_avg: {type: Number},
                f2_avg: {type: Number},
                f3_avg: {type: Number}
            }
            //TODO add more vowel targets
        }
    }
);
