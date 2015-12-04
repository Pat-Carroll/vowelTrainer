/**
 * Created by patrick on 10/3/15.
 */


SentenceProductions = new Meteor.Collection(
    'sentenceProductions',
    {
        owner: {type: String},
        sentenceId: {type: String},


        vowelAttempts: [{

            recordingPath: {type: String},
            timestamp: {type: Date},
            phone: {type: String},
            pho_start: {type: Number},
            pho_end: {type: Number},
            pho_length: {type: Number},
            //pho_center_quadrile: {type: [Number]},  // This is now done automatically in Praat

            f1_avg: {type: Number}, // averaged center quadrile of Formant readings in the center 25% of vowel duration.
            f2_avg: {type: Number}, // averaged center quadrile of Formant readings in the center 25% of vowel duration.
            f3_avg: {type: Number}, // averaged center quadrile of Formant readings in the center 25% of vowel duration.

            word_phones: {type:String}, // string of phones for word in which vowel is located
            word_length: {type: Number},
            left_context: {type: String},
            right_context: {type: String}

        }]


    }

);