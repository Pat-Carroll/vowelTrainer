Template.setup.events = {
    'click input[type=submit]': function (event) {
        //event.preventDefault();

        var user = {
            owner: Meteor.userId(),
            username: $('#username').val(),
            age: $('#age').val(),
            gender: $('#gender').val(),
            motherLang: $('#motherLang').val()

        };

        console.log(user);

        if (!user.username || !user.motherLang) {
            flash('Please fill in all fields');
        } else {
            //TODO handle already registered users!!!
            var cardVowels = CardinalVowels.insert({owner: Meteor.userId()});
            var sentences = Sentences.insert({owner: Meteor.userId()});
            user.cardinalVowels = cardVowels;
            user.sentences = sentences;
            PersonProfiles.insert(user);
            Router.go('/');
        }

    }
};