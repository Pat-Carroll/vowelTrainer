var last_visited;

Template.scatterplot.onCreated(function () {
    last_visited = new Date();
});


Template.scatterplot.onRendered(function () {


});

Template.scatterplot.helpers({
    'displayPlot': function (sentenceID) {

        var vowel_target = [[1600, 250, 2000]];

        var current_production_sentences = SentenceProductions.find({
            owner: Meteor.userId(),
            sentenceId: sentenceID,
            timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});

        var vowel_productions_user_curr;
        var vowel_productions_user = [];
        current_production_sentences.forEach(function (doc) {
            if (!vowel_productions_user_curr)
                vowel_productions_user_curr = [{x:doc.f2_avg, y:doc.f1_avg, z:doc.f3_avg, id: doc._id}];
            else
                vowel_productions_user.push({x:doc.f2_avg, y:doc.f1_avg, z:doc.f3_avg, id: doc._id});
        });


        var sample = SentenceProductions.findOne({type: SentenceProductionsTypes.samples,
            owner: Session.get("SeclectedGerman"),
            sentenceId: sentenceID,
            timestamp: {$gt: last_visited}
        }, {sort: {timestamp: -1}});

        var vowel_productions_germans = [{x:sample.f2_avg, y:sample.f1_avg, z:sample.f3_avg, id: sample._id}];

        $('#container').highcharts({

            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zoomType: 'xy',

            },

            title: {
                text: 'Highcharts bubbles with radial gradient fill'
            },


            xAxis: {
                gridLineWidth: 1,
                max: 3000,
                min: 800,
                opposite : true
            },

            yAxis: {
                startOnTick: false,
                endOnTick: false,
                max: 800,
                min: 150,
                opposite : true
            },

            plotOptions: {
              series:{
                  point:{
                      events:{
                          click: onPointClick
                      }
                  }
              }
            },

            series: [{
                name: "Your last try",
                data: vowel_productions_user_curr,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }, {
                name: "Target",
                data: vowel_target,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }, {
                name: "German Sample",
                data: vowel_productions_germans,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[3]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }, {
                name: "Your older tries",
                data: vowel_productions_user,
                marker: {
                    fillColor: {
                        radialGradient: {cx: 0.4, cy: 0.3, r: 0.7},
                        stops: [
                            [0, 'rgba(255,255,255,0.5)'],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.5).get('rgba')]
                        ]
                    }
                }
            }]

        });
    }
});

function onPointClick(){
    console.log(this);
    var sentence = SentenceProductions.findOne({_id: this.options.id});

}