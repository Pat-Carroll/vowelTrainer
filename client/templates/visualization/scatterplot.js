var last_visited;

Template.scatterplot.onCreated(function () {
    last_visited = new Date();
});


Template.scatterplot.onRendered(function () {


});

Template.scatterplot.events({

    "click .refresh": function (ev) {
        last_visited = new Date();
        Session.set("clear_graph", "clear");
    }
});

Template.scatterplot.helpers({

    'isHigh': function (sentenceID) {
        var sentence = Sentences.findOne({number: sentenceID});
        return (sentence.focus_vowel === "i:" || sentence.focus_vowel === 'I');

    },

    'isLow': function (sentenceID) {
        var sentence = Sentences.findOne({number: sentenceID});
        return (sentence.focus_vowel === "a:" || sentence.focus_vowel === 'a');

    },

    'isBack': function (sentenceID) {
        var sentence = Sentences.findOne({number: sentenceID});
        return (sentence.focus_vowel === "o:" || sentence.focus_vowel === 'O');

    },

    'displayPlot_high': function (sentenceID) {
        var x = Session.get("clear_graph");
        if (x)
            Session.set("clear_graph", undefined);

        var personProfile = PersonProfiles.findOne({owner: Meteor.userId()});

        var current_production_sentences = SentenceProductions.find({
            owner: Meteor.userId(),
            sentenceId: sentenceID,
            timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});


        var sentence = Sentences.findOne({number: sentenceID});
        var targeVow = personProfile.targetVowels[sentence.focus_vowel];
        var nearbyVowel = personProfile.targetVowels[sentence.nearby_vowel];

        var targetDuration = sentence.target_duration;
        var nearbyTargetDuration;

        if (sentence.number % 2) {
            nearbyTargetDuration = Sentences.findOne({number: sentenceID + 1}).target_duration;
        }
        else {
            nearbyTargetDuration = Sentences.findOne({number: sentenceID - 1}).target_duration;
        }

        var vowel_target = [{x: targeVow.f2_avg, y: targeVow.f1_avg, z: targetDuration, name:sentence.focus_vowel}];
        //TODO get relative duration values from the thing
        var nearby_vowel_target = [{x: nearbyVowel.f2_avg, y:nearbyVowel.f1_avg, z: nearbyTargetDuration, name:sentence.nearby_vowel}];



        var vowel_productions_user_curr;
        var vowel_productions_user = [];
        current_production_sentences.forEach(function (doc) {
            if (!vowel_productions_user_curr)
                vowel_productions_user_curr = [{
                    x: doc.f2_avg,
                    y: doc.f1_avg,
                    z: doc.relative_phone_length,
                    id: doc._id
                }];
            else
                vowel_productions_user.push({x: doc.f2_avg, y: doc.f1_avg, z: doc.relative_phone_length, id: doc._id});
        });


        var sample = SentenceProductions.findOne({
            //type: SentenceProductionsTypes.samples,
            owner: Session.get("SelectedGerman"),
            sentenceId: sentenceID,
            //timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});

        var vowel_productions_germans = [];
        if (sample)
            vowel_productions_germans = [{
                x: sample.f2_avg,
                y: sample.f1_avg,
                z: sample.relative_phone_length,
                id: sample._id
            }];

        var f1_min = 159.6;
        var f1_max = 618.8;
        var f2_min = 984;
        var f2_max = 3494.4;




        $('#container').highcharts({

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy',

            },

            title: {
                text: 'Vowel Visualizer'
            },


            xAxis: {
                gridLineWidth: 1,
                max: f2_min,
                min: f2_max,
                opposite: true,

            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                max: f1_min,
                min: f1_max,
                opposite: true,

            },


            plotOptions: {
                series: {
                    dataLabels:{
                        enabled: true,
                        format: '{point.name}'
                    },
                    point: {
                        events: {
                            click: onPointClick
                        }
                    }
                }
            },

            series: [{
                name: "Letzter Versuch",
                data: vowel_productions_user_curr,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('blue').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }, {
                name: "Ziel",
                data: vowel_target,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('green').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            },
                {
                    name: "Ähnliche Vokal",
                    data: nearby_vowel_target, // TODO implement nearby vowel target.
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('yellow').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                name: "Deutsch Beispiel",
                data: vowel_productions_germans,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('red').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            },
                {
                    name: "Calibration Points",
                    data: [{x:1, y:1, z:5},{x:1,y:1, z:50}],
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('red').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                name: "Frühere Versuche",
                data: vowel_productions_user,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('purple').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }]

        });
    },

    'displayPlot_low': function (sentenceID) {
        var x = Session.get("clear_graph");
        if (x)
            Session.set("clear_graph", undefined);

        var personProfile = PersonProfiles.findOne({owner: Meteor.userId()});

        var current_production_sentences = SentenceProductions.find({
            owner: Meteor.userId(),
            sentenceId: sentenceID,
            timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});


        var sentence = Sentences.findOne({number: sentenceID});
        var targeVow = personProfile.targetVowels[sentence.focus_vowel];
        var nearbyVowel = personProfile.targetVowels[sentence.nearby_vowel];

        var targetDuration = sentence.target_duration;
        var nearbyTargetDuration;

        if (sentence.number % 2) {
            nearbyTargetDuration = Sentences.findOne({number: sentenceID + 1}).target_duration;
        }
        else {
            nearbyTargetDuration = Sentences.findOne({number: sentenceID - 1}).target_duration;
        }

        var vowel_target = [{x: targeVow.f2_avg, y: targeVow.f1_avg, z: targetDuration, name:sentence.focus_vowel}];
        //TODO get relative duration values from the thing
        var nearby_vowel_target = [{x: nearbyVowel.f2_avg, y:nearbyVowel.f1_avg, z: nearbyTargetDuration, name:sentence.nearby_vowel}];



        var vowel_productions_user_curr;
        var vowel_productions_user = [];
        current_production_sentences.forEach(function (doc) {
            if (!vowel_productions_user_curr)
                vowel_productions_user_curr = [{
                    x: doc.f2_avg,
                    y: doc.f1_avg,
                    z: doc.relative_phone_length,
                    id: doc._id
                }];
            else
                vowel_productions_user.push({x: doc.f2_avg, y: doc.f1_avg, z: doc.relative_phone_length, id: doc._id});
        });


        var sample = SentenceProductions.findOne({
            //type: SentenceProductionsTypes.samples,
            owner: Session.get("SelectedGerman"),
            sentenceId: sentenceID,
            //timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});

        var vowel_productions_germans = [];
        if (sample)
            vowel_productions_germans = [{
                x: sample.f2_avg,
                y: sample.f1_avg,
                z: sample.relative_phone_length,
                id: sample._id
            }];

        var f1_min = 317.4;
        var f1_max = 1232;
        var f2_min = 699.6;
        var f2_max = 2216.2;



        $('#container').highcharts({

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy',

            },

            title: {
                text: 'Vowel Visualizer'
            },


            xAxis: {
                gridLineWidth: 1,
                max: f2_min,
                min: f2_max,
                opposite: true,

            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                max: f1_min,
                min: f1_max,
                opposite: true,

            },


            plotOptions: {
                series: {
                    dataLabels:{
                        enabled: true,
                        format: '{point.name}'
                    },
                    point: {
                        events: {
                            click: onPointClick
                        }
                    }
                }
            },

            series: [{
                name: "Letzter Versuch",
                data: vowel_productions_user_curr,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('blue').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }, {
                name: "Ziel",
                data: vowel_target,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('green').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            },
                {
                    name: "Ähnliche Vokal",
                    data: nearby_vowel_target, // TODO implement nearby vowel target.
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('yellow').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                    name: "Deutsch Beispiel",
                    data: vowel_productions_germans,
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('red').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                    name: "Calibration Points",
                    data: [{x:1, y:1, z:5},{x:1,y:1, z:50}],
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('red').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                    name: "Frühere Versuche",
                    data: vowel_productions_user,
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('purple').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                }]

        });
    },

    'displayPlot_back': function (sentenceID) {
        var x = Session.get("clear_graph");
        if (x)
            Session.set("clear_graph", undefined);

        var personProfile = PersonProfiles.findOne({owner: Meteor.userId()});

        var current_production_sentences = SentenceProductions.find({
            owner: Meteor.userId(),
            sentenceId: sentenceID,
            timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});


        var sentence = Sentences.findOne({number: sentenceID});
        var targeVow = personProfile.targetVowels[sentence.focus_vowel];
        var nearbyVowel = personProfile.targetVowels[sentence.nearby_vowel];

        var targetDuration = sentence.target_duration;
        var nearbyTargetDuration;

        if (sentence.number % 2) {
            nearbyTargetDuration = Sentences.findOne({number: sentenceID + 1}).target_duration;
        }
        else {
            nearbyTargetDuration = Sentences.findOne({number: sentenceID - 1}).target_duration;
        }

        var vowel_target = [{x: targeVow.f2_avg, y: targeVow.f1_avg, z: targetDuration, name:sentence.focus_vowel}];
        //TODO get relative duration values from the thing
        var nearby_vowel_target = [{x: nearbyVowel.f2_avg, y:nearbyVowel.f1_avg, z: nearbyTargetDuration, name:sentence.nearby_vowel}];



        var vowel_productions_user_curr;
        var vowel_productions_user = [];
        current_production_sentences.forEach(function (doc) {
            if (!vowel_productions_user_curr)
                vowel_productions_user_curr = [{
                    x: doc.f2_avg,
                    y: doc.f1_avg,
                    z: doc.relative_phone_length,
                    id: doc._id
                }];
            else
                vowel_productions_user.push({x: doc.f2_avg, y: doc.f1_avg, z: doc.relative_phone_length, id: doc._id});
        });


        var sample = SentenceProductions.findOne({
            //type: SentenceProductionsTypes.samples,
            owner: Session.get("SelectedGerman"),
            sentenceId: sentenceID,
            //timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});

        var vowel_productions_germans = [];
        if (sample)
            vowel_productions_germans = [{
                x: sample.f2_avg,
                y: sample.f1_avg,
                z: sample.relative_phone_length,
                id: sample._id
            }];

        var f1_min = 211.2;
        var f1_max = 924;
        var f2_min = 464.4;
        var f2_max = 1790.6;


        $('#container').highcharts({

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy',

            },

            title: {
                text: 'Vowel Visualizer'
            },


            xAxis: {
                gridLineWidth: 1,
                max: f2_min,
                min: f2_max,
                opposite: true,

            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                max: f1_min,
                min: f1_max,
                opposite: true,

            },


            plotOptions: {
                series: {
                    dataLabels:{
                        enabled: true,
                        format: '{point.name}'
                    },
                    point: {
                        events: {
                            click: onPointClick
                        }
                    }
                }
            },

            series: [{
                name: "Letzter Versuch",
                data: vowel_productions_user_curr,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('blue').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            },
            {
                name: "Ziel",
                data: vowel_target,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color('green').setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            },
                {
                    name: "Ähnliche Vokal",
                    data: nearby_vowel_target, // TODO implement nearby vowel target.
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('yellow').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                    name: "Deutsch Beispiel",
                    data: vowel_productions_germans,
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('red').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                    name: "Calibration Points",
                    data: [{x:1, y:1, z:5},{x:1,y:1, z:50}],
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('red').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                },
                {
                    name: "Frühere Versuche",
                    data: vowel_productions_user,
                    marker: {
                        fillColor: {
                            radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                            stops: [
                                [0, 'rgba(255,255,255,0.5)'],
                                [1, Highcharts.Color('purple').setOpacity(0.5).get('rgba')]
                            ]
                        }
                    }
                }
                ]

        });
    }
});

function onPointClick() {
    console.log(this);
    var sentence = SentenceProductions.findOne({_id: this.options.id});

    var au = $('#datapointAudio');
    var audioFile = UserAudio.findOne({_id: sentence.recordingId});
    var url = audioFile.url();
    au.attr('src', url);
    au[0].play();


}