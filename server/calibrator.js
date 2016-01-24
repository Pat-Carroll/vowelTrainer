var femaleGermanCorners = { 'a:':{f1:779, f2:1347}, 'i:':{f1:329 ,f2:2316}, 'u:':{f1: 350,f2:1048}};
var maleGermanCorners = { 'a:':{f1:639, f2:1125}, 'i:':{f1:290 ,f2:1986}, 'u:':{f1: 309,f2:961}};

var femaleGermanRemainingVowels = {
    "I":  {f1:391 , f2:2136 },
    "y:": {f1:342 , f2:1667 },
    "Y":  {f1:406 , f2:1612 },
    "e:": {f1:431 , f2:2241 },
    "E":  {f1:592 , f2:1944},
    "eu": {f1:434 , f2:1646 },
    "oe": {f1:509 , f2:1767 },
    "a":  {f1:751 , f2:1460 },
    "o:": {f1:438 , f2:953 },
    "O":  {f1:573 , f2:1174 },
    "U":  {f1:450 , f2:1184 },
};

var MaleGermanRemainingVowels = {
    "I":  {f1:343 , f2:1803 },
    "y:": {f1:310 , f2:1505 },
    "Y":  {f1:374 , f2:1431 },
    "e:": {f1:372 , f2:1879 },
    "E":  {f1:498 , f2:1639 },
    "eu": {f1:375 , f2:1458 },
    "oe": {f1:437 , f2:1504 },
    "a":  {f1:608 , f2:1309 },
    "o:": {f1:380 , f2:907 },
    "O":  {f1:506 , f2:1060 },
    "U":  {f1:382 , f2:1058 },
};



Meteor.methods({
    calculateCalibration: function () {
        var targetVowels = {};

        for (var j = 0; j < 9; j++) {
            var prod = SentenceProductions.findOne({owner: Meteor.userId(), sentenceId: j}, {sort: {timestamp: -1}});
            console.log(prod.phone);

            if(!targetVowels[prod.phone])
                targetVowels[prod.phone] = {total: 0, f1_avg: 0, f2_avg: 0, f3_avg: 0};

            var vowel = targetVowels[prod.phone];
            vowel.f1_avg = (vowel.total * vowel.f1_avg + prod.f1_avg) / (vowel.total+1);
            vowel.f2_avg = (vowel.total * vowel.f2_avg + prod.f2_avg) / (vowel.total+1);
            vowel.f3_avg = (vowel.total * vowel.f3_avg + prod.f3_avg) / (vowel.total+1);
            vowel.total++;


        }

        console.log(targetVowels)

        var userCorners = [
            [targetVowels['a:'].f1_avg, targetVowels['a:'].f2_avg],
            [targetVowels['i:'].f1_avg, targetVowels['i:'].f2_avg],
            [targetVowels['u:'].f1_avg, targetVowels['u:'].f2_avg],
            [506, 907],
        ];

        var gender = PersonProfiles.findOne({owner:Meteor.userId()}).gender;
        var remainingVowels;
        var germanCorners;

        if (gender == "Adult male"){
             germanCorners = [
                [maleGermanCorners['a:'].f1, maleGermanCorners['a:'].f2],
                [maleGermanCorners['i:'].f1, maleGermanCorners['i:'].f2],
                [maleGermanCorners['u:'].f1, maleGermanCorners['u:'].f2],
                 [506, 907],
            ]
            remainingVowels = MaleGermanRemainingVowels;
        }

        else {
             germanCorners = [
                [femaleGermanCorners['a:'].f1, femaleGermanCorners['a:'].f2],
                [femaleGermanCorners['i:'].f1, femaleGermanCorners['i:'].f2],
                [femaleGermanCorners['u:'].f1, femaleGermanCorners['u:'].f2],
            ]
            remainingVowels = femaleGermanRemainingVowels;
        }

        var keys = Object.keys(remainingVowels);

        var nudged = Meteor.npmRequire('nudged');

        //var nudged = new Nudgedapi ({version:'1.0.1'});

        var nudgedPoints = Async.runSync(function(done){

            var trans = nudged.estimate('TSR', germanCorners, userCorners);

            keys.forEach(function (key) {
                var point = remainingVowels[key];
                transformedPoint = trans.transform([point.f1, point.f2]);
                targetVowels[key] = {total: 0, f1_avg: transformedPoint[0], f2_avg: transformedPoint[1], f3_avg: 0};
            });

            done (null, 1)
        });

        console.log(nudgedPoints.result);

        console.log(targetVowels);



        //TODO calculate other vowels
        PersonProfiles.update({owner: Meteor.userId()}, {
            $set: {
                targetVowels: targetVowels
            }
        })

    }
});


