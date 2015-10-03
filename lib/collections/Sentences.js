/**
 * Created by patrick on 10/3/15.
 */


Sentences = new Meteor.Collection(
    'sentences',
    {
        owner: {type: String},
        sentenceText: {type: String},
        sentencePhonTrans: {type: String},


        vowelAttempts: [{

            sentencePath: {type: String},
            timestamp: {type: Date},
            phone: {type: String},
            pho_start: {type: Number},
            pho_end: {type: Number},
            pho_lenght: {type: Number},
            pho_center_quadrile: {type: [Number]},  //  [startTime, endTime]
            left_context: {type: String},
            right_context: {type: String},
            f1_values: {type: [Number]},
            f2_values: {type: [Number]},
            f3_values: {type: [Number]},
            f1_f2_f3_avg: {type: [Number]} //[ F1_avg, F2_avg, F3_avg]

        }]


    }

);