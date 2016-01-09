Template.progress.onRendered(function(){
    Session.set("selectedVowel","b:");


});

Template.progress.events(
    {
        "click .js-select-vowel": function(ev){
            Session.set("selectedVowel",ev.currentTarget.attributes["value"].nodeValue);

        },

        "click .js-select-acoustic": function(ev) {

            $('#container_acoustic').show();
            $('#container_duration').hide();
        },

        "click .js-select-duration": function(ev) {

            $('#container_acoustic').hide();
            $('#container_duration').show();
        }

    }
)

Template.progress.helpers({
    getSelectedVowel: function(){return Session.get("selectedVowel")},

    drawGraph: function(vowel){
        var personProfile =  PersonProfiles.findOne({owner: Meteor.userId()});
        var sentences = SentenceProductions.find({owner: Meteor.userId(), phone: vowel, type: SentenceProductionsTypes.training},{sort:{timestamp: -1}});
        var dataF1F2Dist = [];
        var dataDurDist = [];
        var targeVowel = personProfile.targetVowels[vowel];
        sentences.forEach(function(doc){
            f1_f2_target_distance = Math.sqrt(Math.pow(targeVowel.f1_avg - doc.f1_avg,2)+Math.pow(targeVowel.f2_avg - doc.f2_avg,2));
            // the 2300 is the calculated max distance diagonally across the vowel space
            dataF1F2Dist.push({y:1 - f1_f2_target_distance/ 2300, id: doc._id});

            var duration = targeVowel.f3_avg - doc.f3_avg;
            // TODO replace f3 with duration value that is sane.
                dataDurDist.push(1-duration/7000);
        });



        $('#container_acoustic').highcharts({
            title: {
                text: 'Acoustic Progress',
                x: -20 //center
            },

            xAxis: {

            },
            yAxis: {
                min:.5,
                max: 1,
                title: {
                    text: 'F1 & F2 distance from target'
                },
                plotLines: [{
                    value:.5,
                    width: 1,
                    color: '#808080'
                }]
            },

            plotOptions: {
                series: {
                    point: {
                        events: {
                            click: onPointClick
                        }
                    }
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'acoustic distance from target',
                data: dataF1F2Dist
            },
            //    {
            //    name: 'Duration distance from target',
            //    data: dataDurDist
            //}
            ]
        });

        $('#container_duration').highcharts({
            title: {
                text: 'Duration Progress',
                x: -20 //center
            },

            xAxis: {

            },
            yAxis: {
                min:.5,
                max: 1,
                title: {
                    text: 'F1 & F2 distance from target'
                },
                plotLines: [{
                    value:.5,
                    width: 1,
                    color: '#808080'
                }]
            },

            plotOptions: {
                series: {
                    point: {
                        events: {
                            click: onPointClick
                        }
                    }
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'acoustic distance from target',
                data: dataF1F2Dist
            },
                //    {
                //    name: 'Duration distance from target',
                //    data: dataDurDist
                //}
            ]
        });
    }
});


function onPointClick() {
    console.log(this);

    $('.playback-buttons').show();

    var sentence = SentenceProductions.findOne({_id: this.options.id});
    var au = $('.playUserAudio');
    var audioFile = UserAudio.findOne({_id: sentence.recordingId});
    var url = audioFile.url();
    au.attr('src', url);
    au[0].play();


}