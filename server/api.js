

var baseAppPath = process.env.PWD;
var audioFilePath = baseAppPath + "/.meteor/local/cfs/files/userAudio/";
var publicPath = baseAppPath + "/public/";

Meteor.methods({
    'saveCalibrationVowel': function (vowel, audio) {
        //Todo do some script calling etc.

        console.log(vowel);
        var userProfile = PersonProfiles.findOne({owner: Meteor.userId()});
        console.log("gender" + userProfile.gender);

        //Before anything else can happen, a file must be created on the File System so scripts can manipulate it.
        var sampleId = UserAudio.insert(audio, function (err, fileObj){
            if (err){
                console.log(err);
            }
            else {


                    // This function is called after a file object is stored in the CFS file system (On server)
                    function afterInsert(fileObjT) {


                            if (fileObjT._id != fileObj._id) {
                                return;
                            }


                            var audioFileName = "userAudio-" + fileObj._id + "-undefined";

                            //console.log("Vowel: " + vowel + " added" + xxx++ + " with Id: " + fileObj._id);


                            var spawn = Npm.require('child_process').spawn;
                            var command = spawn('/Applications/Praat.app/Contents/MacOS/Praat', [publicPath +'/Scripts/formant_grabber.praat', audioFilePath + audioFileName, '1.16', '1.23', userProfile.gender]);

                            command.stdout.on('data', function (data) {
                                console.log('stdout:' + data);
                            });

                            command.stderr.on('data', function (data) {
                                console.log('stderr:' + data);
                            });
                            command.on('exit', function (code) {
                                console.log('child process exited with code: ' + code);
                            });

                            // After the function does it's script calling and is finished.  It removes the callback from the event queue.
                            UserAudio.removeListener("stored", afterInsert);

                        }
                // The function is defiend above, is triggered by a "stored" event from CFS,  and gets called here.
                UserAudio.on("stored", afterInsert);

                }
        });



        //Todo save stuff in userProfile

        console.log("Vowel: " + vowel + " added for "+userProfile.username+"! " + sampleId._id);
        switch (vowel) {
            case 'a':
                CardinalVowels.update({_id: userProfile.cardinalVowels}, {$set: {sampleFileA: sampleId._id}});
                break;
            case 'i':
                CardinalVowels.update({_id: userProfile.cardinalVowels}, {$set: {sampleFileI: sampleId._id}});
                break;
            case 'u':
                CardinalVowels.update({_id: userProfile.cardinalVowels}, {$set: {sampleFileU: sampleId._id}});
                break;
            default :
                throw new Meteor.Error("Illegal vowel!");
                break;
        }

    },

    'saveSentenceSample': function (sentenceNum, audio) {

        console.log("sentence Number : " + sentenceNum);

        //Before anything else can happen, a file must be created on the File System so scripts can manipulate it.
        UserAudio.insert(audio, function (err, fileObj){
            if (err){
                console.log(err);
            }
            else {

                var audioFileName = "userAudio-" + fileObj._id + "-undefined";
                var sentencePath = publicPath + "Sentences/sentence" + sentenceNum + ".txt";
                var tempPath = baseAppPath + "/.temp/" + Meteor.userId();

                console.log("AudioFilePath: " +audioFilePath + audioFileName);
                console.log("Sentencepath: " + sentencePath);
                console.log("Temppath: " + tempPath);

                // This function is called after a file object is stored in the CFS file system (On server)
                function afterInsertFA(fileObjT) {

                    if (fileObjT._id != fileObj._id) {
                        return;
                    }

                    var spawn = Npm.require('child_process').spawn;

                    var command = spawn('perl', [publicPath + '/Scripts/HTK_forced_align/doalign_kiel_2pass.pl', audioFilePath + audioFileName, sentencePath, tempPath + ".textgrid", tempPath + ".txt"]);

                    command.stdout.on('data', function (data) {
                        console.log('stdout:' + data);
                    });

                    command.stderr.on('data', function (data) {
                        console.log('stderr:' + data);

                    });
                    command.on('exit', Meteor.bindEnvironment(function (code) {
                        console.log("Forced Alignment done");
                        var textGrid = extractFAdata(tempPath + ".textgrid");
                        formantAnalysis(textGrid, sentenceNum, fileObj);



                    }));

                    // After the function does it's script calling and is finished.  It removes the callback from the event queue.
                    UserAudio.removeListener("stored", Meteor.bindEnvironment(afterInsertFA));

                }
            // The function is defiend above, is triggered by a "stored" event from CFS,  and gets called here.

            UserAudio.on("stored", Meteor.bindEnvironment(afterInsertFA));

            }
        });


    }


});

function extractFAdata (datapath) {

    var fs = Npm.require('fs');
    var textGrid = fs.readFileSync(datapath, 'utf8');
    var data = TextGrid.toJSON(textGrid);
    return data;

};

function formantAnalysis (textGrid, sentenceNum, fileObj) {

    console.log("beginning Formant Anlaysis:");

    var currentSentence = Sentences.findOne({number:sentenceNum});

    // Iterate over the JSON version of text grid to obtain the correct vowel
    var focusVowelNumber = currentSentence.focus_Vow_Num;
    var rawPhoneInterval = textGrid.obj.item[0].intervals;
    var correctedPhoneInterval = [];
    console.log(rawPhoneInterval.length);

    for (var i=0; i < rawPhoneInterval.length; i++){

        if (rawPhoneInterval[i].text != '#'){

            correctedPhoneInterval.push(rawPhoneInterval[i])
        }
    }
    console.log(correctedPhoneInterval);
    var targetVowel = correctedPhoneInterval[focusVowelNumber];


    // Iterate over the JSON text grid to obtain the correct word containing the vowel
    var focusWordNumber = currentSentence.focus_word_Num;
    var rawWordInterval = textGrid.obj.item[1].intervals;
    var correctedWordInterval = [];

    for (var j=0; j < rawWordInterval.length; j++){
        if (rawWordInterval[j].text != 'sil'){
            correctedWordInterval.push(rawWordInterval[j])
        }
    }
    var targetWord = correctedWordInterval[focusWordNumber];

    // Get this information about filename and userProfile for use in script and later Inserting Data
    var audioFileName = "userAudio-" + fileObj._id + "-undefined";
    var userProfile = PersonProfiles.findOne({owner: Meteor.userId()});


    // The script call to perform Formant Analysis
    var spawn = Npm.require('child_process').spawn;
    var command = spawn('/Applications/Praat.app/Contents/MacOS/Praat', [publicPath +'/Scripts/formant_grabber.praat', audioFilePath + audioFileName, targetVowel.xmin, targetVowel.xmax, userProfile.gender]);


    // When Formant Data is returned via standard out, we grab it and do something with it
    var formantData;
    command.stdout.on('data', function (data) {
        var myRegEx =/(\d*\.\d*)\D*(\d*\.\d*)\D*(\d*\.\d*)/gm;;
        formantData = myRegEx.exec(data);


        //TODO insert some REGEX to format the formant data.
        console.log('stdout:' + formantData);
    });

    command.stderr.on('data', function (data) {
        console.log('stderr:' + data);
    });
    command.on('exit', Meteor.bindEnvironment(function (code) {

        console.log('child process exited with code: ' + code);
        if(Formant.checkFormants(formantData, targetVowel)){
            SentenceProductions.insert(
                {
                    owner: Meteor.userId(),
                    sentenceId: sentenceNum,
                    timestamp: new Date(),

                    sentenceTextGrid: textGrid,
                    recordingPath: audioFilePath + audioFileName,

                    phone: currentSentence.focus_vowel,
                    pho_start: targetVowel.xmin,
                    pho_end: targetVowel.xmax,
                    pho_length: targetVowel.xmax - targetVowel.xmin,

                    f1_avg: formantData[1], // averaged center quadrile of Formant readings in the center 25% of vowel duration.
                    f2_avg: formantData[2], // averaged center quadrile of Formant readings in the center 25% of vowel duration.
                    f3_avg: formantData[3], // averaged center quadrile of Formant readings in the center 25% of vowel duration.

                    word_text: currentSentence.focus_word, // string of phones for word in which vowel is located
                    word_Num: currentSentence.focus_word_Num,
                    word_start: targetWord.xmin,
                    word_end: targetWord.xmax,
                    word_length: targetWord.xmax - targetWord.xmin
                })
        }

    }));


}

