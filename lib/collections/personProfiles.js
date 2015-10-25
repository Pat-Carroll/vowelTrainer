/**
 * Created by patrick on 10/3/15.
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
        cardinalVowels: {type: String}, //reference to cardVowels
        sentences: {type: String} //reference to cardVowels
    }
);
