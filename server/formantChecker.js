/**
 * Created by patrick on 12/11/15.
 */

//
//var formantValues = {
//    "i:": {"minF1": 212.8, "maxF1":462, "minF2":1450.4, "maxF2":2995.2, "minF3":1862.4, "maxF3":3600},
//    "I": {"minF1": 242.4, "maxF1":530.4, "minF2":1312, "maxF2":2817.6, "minF3":1847.2, "maxF3":3631.2},
//    "y:": {"minF1": 222.4, "maxF1":481.2, "minF2":1089.6, "maxF2":2199.6, "minF3":1693.6, "maxF3":3229.2},
//    "Y": {"minF1": 266.4, "maxF1":559.2, "minF2":1076, "maxF2":2082, "minF3":1704.8, "maxF3":3334.8},
//    "e:": {262.4	594	1360	2966.4	1859.2	3666},
//    "E": {354.4	824.4	1213.6	2520	1839.2	3596.4},
//    "eu:":
//    "oe":
//
//
//
//
//}

Formant = {};

    Formant.checkFormants = function (formantData, phone) {
        //TODO code the sanity check for formants
        return true;
        var production = SentenceProductions.findOne(sentenceProductionId);

        var formantValues = {
            f1: production.f1_avg,
            f2: production.f2_avg,
            f3: production.f3_avg
        };


        
    };




//checking to see that formant values are within a reasonable maximum and minimum range for vowel categories
//right now, seting lower limits 20% lower than reported lower quartile from the Kiel Corpus [Pätzold, Matthias
//Simpson, Adrian P.] and upper limit 20% higher than reported upper quartile.  Range inclusive of male and female
//values, generally with male values representing lowest bounds and female values representing upper bounds.


