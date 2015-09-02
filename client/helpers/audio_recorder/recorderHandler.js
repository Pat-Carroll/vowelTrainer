
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


// global variable for the current audio blob
var currentAudioBlob;

// function for requesting the media stream
function setupMedia() {
    
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
    
};


// exposed template helpers
Template.recorderHandler.helpers({
    'supportsMedia': function(){
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    }


}) 

Template.recorderHandler.onLoad = function () {
    setupMedia();
};


Template.recorderHandler.events = {
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

        var url = URL.createObjectURL(audioBlob);
        var li = document.createElement('li');
        var au = document.createElement('audio');
        

        au.controls = true;
        au.src = url;
        li.appendChild(au);
        recordingslist.appendChild(li);
        // save the blob to a global variable

        currentAudioBlob = audioBlob;

        var fileObj = UserAudio.insert(audioBlob);
        
    });

    //uploadRecording();
}

function uploadRecording() {

    var savedate = Date.now();


    var fileObj = UserAudio.insert(currentAudioBlob);

    CardinalVowels.update({ owner: Meteor.userId() },
   {
     $set: { u_values_path: fileObj, timestamp: savedate },
     $currentDate: { lastModified: true }
   });

console.log("Audio uploaded");
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





