iter = 0;
if (Meteor.isServer){
    Meteor.startup(function(){
        if (Sentences.find().count() === 0) {


            console.log ("Adding sentences to DB...");

            var trainingSentences = [

                //{number: iter++,
                //    text: "",
                //    phon_transcription: "",
                //    focus_vowel: "",
                //    focus_Vow_Num: 0,
                //    focus_word: ""
                //    focus_word_Num: 0
                //},
                {number: iter++,
                    text: "a",
                    phon_transcription: "Q Q_ a:",
                    focus_vowel: "a:",
                    focus_Vow_Num: 2,
                    focus_word: "a:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "i",
                    phon_transcription: "Q Q_ i:",
                    focus_vowel: "i:",
                    focus_Vow_Num: 2,
                    focus_word: "i:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "u",
                    phon_transcription: "Q Q_ u:",
                    focus_vowel: "u:",
                    focus_Vow_Num: 2,
                    focus_word: "u:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "a",
                    phon_transcription: "Q Q_ a:",
                    focus_vowel: "a:",
                    focus_Vow_Num: 2,
                    focus_word: "a:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "i",
                    phon_transcription: "Q Q_ i:",
                    focus_vowel: "i:",
                    focus_Vow_Num: 2,
                    focus_word: "i:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "u",
                    phon_transcription: "Q Q_ u:",
                    focus_vowel: "u:",
                    focus_Vow_Num: 2,
                    focus_word: "u:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "a",
                    phon_transcription: "Q Q_ a:",
                    focus_vowel: "a:",
                    focus_Vow_Num: 2,
                    focus_word: "a:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "i",
                    phon_transcription: "Q Q_ i:",
                    focus_vowel: "i:",
                    focus_Vow_Num: 2,
                    focus_word: "i:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "u",
                    phon_transcription: "Q Q_ u:",
                    focus_vowel: "u:",
                    focus_Vow_Num: 2,
                    focus_word: "u:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "a",
                    phon_transcription: "Q Q_ a:",
                    focus_vowel: "a:",
                    focus_Vow_Num: 2,
                    focus_word: "a:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "i",
                    phon_transcription: "Q Q_ i:",
                    focus_vowel: "i:",
                    focus_Vow_Num: 2,
                    focus_word: "i:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "u",
                    phon_transcription: "Q Q_ u:",
                    focus_vowel: "u:",
                    focus_Vow_Num: 2,
                    focus_word: "u:",
                    focus_word_Num: 0

                },
                {number: iter++,
                    text: "geburtstag",
                    phon_transcription: "g g_ @ b b_ Uer ts ts_ t t_ a: k k_",
                    focus_vowel: "a:",
                    focus_Vow_Num: 10,
                    focus_word: "g g_ @ b b_ Uer ts ts_ t t_ a: k k_",
                    focus_word_Num: 0
                },
                {number: iter++,
                    text: "kahn",
                    phon_transcription: "k k_ a: n",
                    focus_vowel: "a:",
                    focus_Vow_Num: 2,
                    focus_word: "k k_ a: n",
                    focus_word_Num: 0
                },
                {number: iter++,
                    text: "kann",
                    phon_transcription: "k k_ a n",
                    focus_vowel: "a",
                    focus_Vow_Num: 2,
                    focus_word: "k k_ a n",
                    focus_word_Num: 0
                },
                {number: iter++,
                    text: "abend geburtstag kahn",
                    phon_transcription: "Q Q_ a: b b_ @ n t t_ g g_ @ b b_ Uer ts ts_ t t_ a: k k_ k k_ a: n",
                    focus_vowel: "a:",
                    focus_Vow_Num: 2,
                    focus_word: "Q Q_ a: b b_ @ n t t_",
                    focus_word_Num: 0
                },
                {number: iter++,
                    text: "abend",
                    phon_transcription: "Q Q_ a: b b_ @ n t t_",
                    focus_vowel: "a:",
                    focus_Vow_Num: 2,
                    focus_word: "Q Q_ a: b b_ @ n t t_",
                    focus_word_Num: 0

                },



            ];



            _.each(trainingSentences, function(entry){
                var fs = Npm.require('fs');
                var path = process.env.PWD + "/public/Sentences/";
                //console.log("Path is:" + path);
                fs.writeFile(path + "sentence" + entry.number + ".txt", entry.text,
                    function(err){
                        if (err) throw err;
                        console.log('saved ' + "sentence" + entry.number + ".txt to file system");

                });
                Sentences.insert(entry);
            });
            console.log("finished inserting sentences in DB...")
        }
    })
}


