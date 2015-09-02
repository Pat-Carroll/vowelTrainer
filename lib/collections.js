PersonProfiles = new Meteor.Collection(
	'personProfiles',
 {
 		owner: {type: String},  //use the Meteor.userId()
        userName: {type: String},
        motherLang: {type: String},
        gender: {type: String},
        profilePic: {type: String},
        age: {type: Date},
        vis_accoustic: {type: String},
        vis_duration: {type: String},
        cardinal_vowels: {type: [Object]},
        sentence_data: {type: [Object]}


    }
);


CardinalVowels = new Meteor.Collection(
	'cardinalVowels',
	{
		owner: {type: String},
		timestamp: {type: Date},
		u_values_path: {type: String},
		u_values_f1: {type: [Number]},
		u_values_f2: {type: [Number]},
		u_values_f3: {type: [Number]},
		u_avg_f1_f2_f3: {type: [Number]}, //[ F1_avg, F2_avg, F3_avg]

		i_values_path: {type: String},
		i_values_f1: {type: [Number]},
		i_values_f2: {type: [Number]},
		i_values_f3: {type: [Number]},
		i_avg_f1_f2_f3: {type: [Number]}, //[ F1_avg, F2_avg, F3_avg]

		a_values_path: {type: String},
		a_values_f1: {type: [Number]},
		a_values_f2: {type: [Number]},	
		a_values_f3: {type: [Number]},
		a_avg_f1_f2_f3: {type: [Number]}, //[ F1_avg, F2_avg, F3_avg]
	}
);

//UserAudios = new Meteor.Collection();


Sentences = new Meteor.Collection(
	'sentences', 
	{
		owner: {type: String},
		sentenceText: {type: String},
		sentencePhonTrans: {type: String},


		vowelAttempts: [{

			sentencePath: {type: String},
			timestamp: {type: Date},
			phone: {type: String},
			pho_start: {type: Number},
			pho_end: {type: Number},
			pho_lenght: {type: Number},
			pho_center_quadrile: {type: [Number]},  //  [startTime, endTime]
			left_context: {type: String},
			right_context: {type: String},
			f1_values: {type: [Number]},
			f2_values: {type: [Number]},
			f3_values: {type: [Number]},
			f1_f2_f3_avg: {type: [Number]} //[ F1_avg, F2_avg, F3_avg]

		}]


	}

);

UserAudio = new FS.Collection("userAudio", {
    stores: [new FS.Store.FileSystem("userAudio", {path: "~/Audio/uploads"})]
});

