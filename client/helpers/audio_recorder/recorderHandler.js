


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


// exposed template helpers
Template.recorderHandler.helpers({
    'supportsMedia': function(){
        return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
    },

    'setup': function() {
        setupMedia();
        return;
    }


});



Template.recorderHandler.events = {
    'click #start-recording': function (e) {
        console.log("click #start-recording");
        e.preventDefault();

        if (!Meteor.user()) {
            // must be the logged in user
            console.log("\tNO USER LOGGED IN");
            return;
        }
        $('#stop-recording').removeClass('disabled');
        $('#start-recording').addClass('disabled');
        if($('#replay-recording').prop('disabled') == false){
            $('#replay-recording').addClass('disabled');
        }
        startRecording();
    },
    'click #stop-recording': function (e) {
        console.log("click #stop-recording");
        e.preventDefault();


        $('#stop-recording').addClass('disabled');
        $('#start-recording').removeClass('disabled');
        $('#replay-recording').removeClass('disabled');
        if($('#playback-recording')) {
            $('#playback-recording').remove();
        }
        stopRecording();
        completeRecording();
    },

    'click #replay-recording': function (e) {
        e.preventDefault();
        console.log("click #replay-recording");
        $('.playbackRecording.current')[0].play();

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

    console.log("completeRecording: " + user._id);


    audioRecorder.exportWAV(function (audioBlob) {
        var fileReader = new FileReader();

        fileReader.onload = function() {
            var url = fileReader.result;
            console.log(url);
            Session.set('currentRecording', url);

            $('.playbackRecording.current').removeClass('current');
            var au = document.createElement('audio');
            au.src = url;
            au.className = 'playbackRecording current';

            $('#recordings')[0].appendChild(au);
        }
        fileReader.readAsDataURL(audioBlob);

    });

    audioRecorder.clear();
}









