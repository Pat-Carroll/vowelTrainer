
Sentences = new Meteor.Collection('sentences',


    {   number: {type:Number},
        text: {type:String},
        phon_transcription: {type:String},
        focus_vowel: {type:String},
        focus_Vow_Num: {type:Number},
        focus_word: {type:String},
        focus_word_start: {type:Number},
        focus_word_end: {type:Number}
    }

);

