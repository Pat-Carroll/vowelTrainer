Template.progress.onRendered(function(){
    Session.set("selectedVowel","b:");

});

Template.progress.events(
    {
        "click .js-select-vowel": function(ev){
            Session.set("selectedVowel",ev.currentTarget.attributes["value"].nodeValue);
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
            dataF1F2Dist.push(1 - f1_f2_target_distance/ 2300);

            var duration = targeVowel.f3_avg - doc.f3_avg;
            // TODO replace f3 with duration value that is sane.
                dataDurDist.push(1-duration/7000);
        });



        $('#container').highcharts({
            title: {
                text: 'Your Progress',
                x: -20 //center
            },

            xAxis: {

            },
            yAxis: {
                min: 0,
                max: 1,
                title: {
                    text: 'Temperature (°C)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '°C'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Tokyo',
                data: dataF1F2Dist
            },{
                name: 'Duration',
                data: dataDurDist
            }]
        });
    }
})