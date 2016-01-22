/**
 * Created by patrick on 10/3/15.
 */


SentenceProductions = new Meteor.Collection(
    'sentenceProductions',
    {
        owner: {type: String},
        sentenceId: {type: String},
        type: {type: String},
        timestamp: {type: Date},

        sentenceTextGrid: {type:Object},
        recordingPath: {type: String},
        recordingId: {type: String},

        phone: {type: String},
        pho_start: {type: Number},
        pho_end: {type: Number},
        pho_length: {type: Number},
        //pho_center_quadrile: {type: [Number]},  // This is now done automatically in Praat

        f1_avg: {type: Number}, // averaged center quadrile of Formant readings in the center 25% of vowel duration.
        f2_avg: {type: Number}, // averaged center quadrile of Formant readings in the center 25% of vowel duration.
        f3_avg: {type: Number}, // averaged center quadrile of Formant readings in the center 25% of vowel duration.

        word_text: {type:String}, // string of phones for word in which vowel is located
        word_Num: {type: Number},
        word_start: {type: Number},
        word_end: {type: Number},
        word_length: {type: Number},

        relative_phone_length: {type:Number}
    }

);

SentenceProductionsTypes = {
    calibration : "calibration",
    training : "training",
    samples: "sample",
    testing: "testing",
}