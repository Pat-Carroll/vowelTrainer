function createAudioFile (vowel, audio){
    var userProfile = PersonProfiles.findOne({owner: Meteor.userId()});
    var sampleId = UserAudio.insert(audio);
    console.log("Vowel: " + vowel + " added for "+userProfile.username+"! " + sampleId._id);
    var audioFileName = "userAudio-" + sampleId._id + "-undefined";
    return audioFileName;
}

function forceAlign (audioFileName) {
    //TODO some script calling to run the forced aligner
}

function findFormants (callback_audioFile, callback_forceAlign) {

    audioFileName = callback_audioFile()
    var spawn = Npm.require('child_process').spawn;

    // Figure out how to best set relative path to find where the audio file is at
    var command = spawn('/Applications/Praat.app/Contents/MacOS/Praat', ['/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/public/Scripts/formant_grabber.praat', "/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/.meteor/local/cfs/files/userAudio/" + audioFileName, startTime, endTime, gender]);

    command.stdout.on ('data', function (data){
        console.log('stdout:' + data);
    });

    command.stderr.on ('data', function (data){
        console.log('stderr:' + data);
    });

    command.on ('exit', function (code){
        console.log('child process exited with code: ' + code);
    });
}



xxx = 0;
Meteor.methods({
    'saveCalibrationVowel': function (vowel, audio) {
        //Todo do some script calling etc.

        console.log(vowel);

        //Before anything else can happen, a file must be created on the File System so scripts can manipulate it.
        UserAudio.insert(audio, function (err, fileObj){
            if (err){
                console.log(err);
            }
            else {
                // This function is called after a file object is stored in the CFS file system (On server)
                function afterInsert(fileObjT) {

                        console.log ("fileobjT" + fileObjT._id);
                        console.log ("Fileobj" + fileObj._id);
                        if (fileObjT._id != fileObj._id) {
                            return;
                        }


                        var audioFileName = "userAudio-" + fileObj._id + "-undefined";
                        console.log("Vowel: " + vowel + " added" + xxx++ + " with Id: " + fileObj._id);

                        var spawn = Npm.require('child_process').spawn;
                        var command = spawn('/Applications/Praat.app/Contents/MacOS/Praat', ['/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/public/Scripts/formant_grabber.praat', "/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/.meteor/local/cfs/files/userAudio/" + audioFileName, '1.16', '1.23', 'Adult male']);

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


                //function(err, sampleId){
        //    // callback function to execute once the record is inserted into the CFS database and file is made
        //
        //    // logging that the vowel was added
        //    var audioFileName = "userAudio-" + sampleId._id + "-undefined";
        //    console.log("Vowel: " + vowel + " added with Id: " + sampleId._id);
        //
        //    var spawn = Npm.require('child_process').spawn;
        //    command = spawn('/Applications/Praat.app/Contents/MacOS/Praat', ['/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/public/Scripts/formant_grabber.praat', "/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/.meteor/local/cfs/files/userAudio/" + audioFileName, '1.16', '1.23', 'Adult male']);
        //
        //    command.stdout.on ('data', function (data){
        //        console.log('stdout:' + data);
        //    });
        //
        //    command.stderr.on ('data', function (data){
        //        console.log('stderr:' + data);
        //    });
        //
        //    command.on ('exit', function (code){
        //        console.log('child process exited with code: ' + code);
        //    });
        //}


        // First thing is save audio to disk so the scripts have something to work with
        // next we need to find where the vowel was in the audio recording using the Forced alignment script.
        // Then we need to find the acoustic information about the vowel using the Praat script and output from the
        // forced alignment script call.


        //var spawn = Npm.require('child_process').spawn,
        //
        //// Figure out how to best set relative path to find where the audio file is at
        //command = spawn('/Applications/Praat.app/Contents/MacOS/Praat', ['/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/public/Scripts/formant_grabber.praat', "/Users/patrick/Saarland_Documents/Saarland_Masters2015/Meteor_Site/Vowel_train_scaffold/.meteor/local/cfs/files/userAudio/userAudio-mEuKAzJM5Q3tpD5Wm-undefined", '1.16', '1.23', 'Adult male']);
        //
        //command.stdout.on ('data', function (data){
        //    console.log('stdout:' + data);
        //});
        //
        //command.stderr.on ('data', function (data){
        //    console.log('stderr:' + data);
        //});
        //
        //command.on ('exit', function (code){
        //    console.log('child process exited with code: ' + code);
        //});

        //Todo save stuff in userProfile
        var userProfile = PersonProfiles.findOne({owner: Meteor.userId()});
        //var sampleId = UserAudio.insert(audio);
        //console.log("Vowel: " + vowel + " added for "+userProfile.username+"! " + sampleId._id);
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
    'saveSentenceSample': function (sentenceID, audio) {
        //Todo do some script calling etc.

        //Todo save stuff in userProfile
        var userProfile = PersonProfiles.findOne({owner: Meteor.userId()});
        var sampleId = UserAudio.insert(audio);
         //Todo save sentence ref

    }


});