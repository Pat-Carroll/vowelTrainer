/**
 * Created by patrick on 12/11/15.
 */


var formantValues = {
    "i:": {f1Min:159.6,	f1Max:539,	    f2Min:1087.8,	f2Max:3494.4,	f3Min:1396.8,	f3Max:4200},
    "I":  {f1Min:181.8,	f1Max:618.8,	f2Min:984,	    f2Max:3287.2,	f3Min:1385.4,	f3Max:4236.4},
    "y:": {f1Min:166.8,	f1Max:561.4,	f2Min:817.2,	f2Max:2566.2,	f3Min:1270.2,	f3Max:3767.4},
    "Y":  {f1Min:199.8,	f1Max:652.4,	f2Min:807,	    f2Max:2429,	    f3Min:1278.6,	f3Max:3890.6},
    "e:": {f1Min:196.8,	f1Max:693,	    f2Min:1020,	    f2Max:3460.8,	f3Min:1394.4,	f3Max:4277},
    "E":  {f1Min:265.8,	f1Max:961.8,	f2Min:910.2,	f2Max:2940,	    f3Min:1379.4,	f3Max:4195.8},
    "eu": {f1Min:199.8,	f1Max:674.8,	f2Min:829.8,	f2Max:2434.6,	f3Min:1262.4,	f3Max:3791.2},
    "oe": {f1Min:244.2,	f1Max:817.6,	f2Min:825.6,	f2Max:2618,	    f3Min:1272.6,	f3Max:3859.8},
    "a:": {f1Min:342,	f1Max:1232,	    f2Min:699.6,	f2Max:2014.6,	f3Min:1389.6,	f3Max:4117.4},
    "a":  {f1Min:317.4,	f1Max:1173.2,	f2Min:734.4,	f2Max:2216.2,	f3Min:90.2,	    f3Max:4176.2},
    "o:": {f1Min:211.2,	f1Max:681.8,	f2Min:464.4,	f2Max:1542.8,	f3Min:1361.4,	f3Max:4186},
    "O":  {f1Min:273.92,f1Max:924,	    f2Min:595.2,	f2Max:1790.6, 	f3Min:1377,     f3Max:4151},
    "u:": {f1Min:169.8,	f1Max:567,	    f2Min:501,	    f2Max:1708,	    f3Min:1348.2,	f3Max:4027.8},
    "U":  {f1Min:199.2,	f1Max:705.6,	f2Min:579.6,	f2Max:1822.8,	f3Min:1335, 	f3Max:4144},

};

Formant = {};

    Formant.checkFormants = function (formantData, phone) {
        //TODO code the sanity check for formants

        console.log("Phone to check formant: "+ phone);
        var vowelFormantsToCheck = formantValues[phone];

        //console.log(JSON.stringify(vowelFormantsToCheck));

        if (formantData[1] < vowelFormantsToCheck.f1Min || formantData[1] > vowelFormantsToCheck.f1Max){
            console.log("F1 out of range");
            return false;
        }

        if (formantData[2] < vowelFormantsToCheck.f2Min || formantData[2] > vowelFormantsToCheck.f2Max){
            console.log("F2 out of range");
            return false;
        }

        if (formantData[3] < vowelFormantsToCheck.f3Min || formantData[3] > vowelFormantsToCheck.f3Max){
            console.log("F3 out of range");
            return false;
        }
        return true;

        
    };




//checking to see that formant values are within a reasonable maximum and minimum range for vowel categories
//right now, seting lower limits 20% lower than reported lower quartile from the Kiel Corpus [Pätzold, Matthias
//Simpson, Adrian P.] and upper limit 20% higher than reported upper quartile.  Range inclusive of male and female
//values, generally with male values representing lowest bounds and female values representing upper bounds.


