
// verify if the browser supports user media
function supportsMedia() {
    return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}


// cross browser support for getUserMedia
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;


// cross browser support for URL
window.URL = window.URL || window.webkitURL;

// cross browser support for audioContext
window.AudioContext = window.AudioContext || window.webkitAudioContext;


// global variables for recording audio
var mediaInitialized = false;
var recording = false;
var audioContext;
var audioRecorder;

// function for requesting the media stream
function setupMedia() {
    if (supportsMedia()) {
        audioContext = new AudioContext();

        navigator.getUserMedia(
            {
                audio: true
            },
            function (localMediaStream) {

                // setup audio recorder
                var audioInput = audioContext.createMediaStreamSource(localMediaStream);
				//the following code is to mute playback
                // (so you don't get feedback)
                var audioGain = audioContext.createGain();
                audioGain.gain.value = 0;
                audioInput.connect(audioGain);
                audioGain.connect(audioContext.destination);

                audioRecorder = new Recorder(audioInput);
                mediaStream = localMediaStream;
                mediaInitialized = true;

                document.getElementById('uploading').hidden = true;
                document.getElementById('media-error').hidden = true;
                document.getElementById('record').hidden = false;
            },
            function (e) {
                console.log('microphone not initialized: ', e);
                document.getElementById('media-error').hidden = false;
            }
        );
    }
};


// exposed template helpers
Template.calibrate.supportsMedia = supportsMedia;

Template.calibrate.onLoad = function () {
    setupMedia();
};


Template.calibrate.events = {
    'click #start-recording': function (e) {
        console.log("click #start-recording");
        e.preventDefault();

        if (!Meteor.user()) {
            // must be the logged in user
            console.log("\tNO USER LOGGED IN");
            return;
        }
        document.getElementById('stop-recording').disabled = false;
        document.getElementById('start-recording').disabled = true;
        startRecording();
    },
    'click #stop-recording': function (e) {
        console.log("click #stop-recording");
        e.preventDefault();

        document.getElementById('stop-recording').disabled = true;
        document.getElementById('start-recording').disabled = false;
        stopRecording();
        completeRecording();
    }
};


function startRecording() {
    console.log("Begin Recording");

    // begin recording audio
    audioRecorder.record();
}

function stopRecording() {
    console.log("End Recording");
    recording = false;
}

function completeRecording() {
    // stop & export the recorder audio
    audioRecorder.stop();

    var user = Meteor.user();
    if (!user) {
        // must be the logged in user
        console.log("completeRecording - NO USER LOGGED IN");
        return;
    }
    console.log("completeRecording: " + user._id);

    document.getElementById('uploading').hidden = false;

    audioRecorder.exportWAV(function (audioBlob) {
        // save to the db
        BinaryFileReader.read(audioBlob, function (err, fileInfo) {
            UserAudios.insert({
                userId: user._id,
                audio: fileInfo,
                save_date: Date.now()
            });
        });
        console.log("Audio uploaded");
    });

    // stop the stream & redirect to show the video
    mediaStream.stop();
    //Router.go('showVideo', { _id: user._id });
}


var BinaryFileReader = {
    read: function (file, callback) {
        var reader = new FileReader;

        var fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size,
            file: null
        }

        reader.onload = function () {
            fileInfo.file = new Uint8Array(reader.result);
            callback(null, fileInfo);
        }
        reader.onerror = function () {
            callback(reader.error);
        }

        reader.readAsArrayBuffer(file);
    }
}





