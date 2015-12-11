

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
                var tempPath = publicPath + "Temp/" + Meteor.userId();
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
                    command.on('exit', function (code) {

                        console.log("Forced Alignment done?");

                    });

                    // After the function does it's script calling and is finished.  It removes the callback from the event queue.
                    UserAudio.removeListener("stored", afterInsertFA);

                }
            // The function is defiend above, is triggered by a "stored" event from CFS,  and gets called here.

            UserAudio.on("stored", afterInsertFA);

            }
        });


    }


});