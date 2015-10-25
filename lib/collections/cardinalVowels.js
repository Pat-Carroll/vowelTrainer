/**
 * Created by patrick on 10/3/15.
 */


CardinalVowels = new Meteor.Collection(
    'cardinalVowels',
    {
        owner: {type: String},
        timestamp: {type: Date},
        sampleFileU: {type: String},
        u_values_path: {type: String},
        u_values_f1: {type: [Number]},
        u_values_f2: {type: [Number]},
        u_values_f3: {type: [Number]},
        u_avg_f1_f2_f3: {type: [Number]}, //[ F1_avg, F2_avg, F3_avg]


        sampleFileI: {type: String},
        i_values_path: {type: String},
        i_values_f1: {type: [Number]},
        i_values_f2: {type: [Number]},
        i_values_f3: {type: [Number]},
        i_avg_f1_f2_f3: {type: [Number]}, //[ F1_avg, F2_avg, F3_avg]


        sampleFileA: {type: String},
        a_values_path: {type: String},
        a_values_f1: {type: [Number]},
        a_values_f2: {type: [Number]},
        a_values_f3: {type: [Number]},
        a_avg_f1_f2_f3: {type: [Number]} //[ F1_avg, F2_avg, F3_avg]
    }
);
