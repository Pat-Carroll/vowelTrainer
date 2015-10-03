
Template.setup.events = {
  'click input[type=submit]': function(event){
    //event.preventDefault();

    var user = {
      owner: Meteor.userId(),
      username: $('#username').val(),
      age: $('#age').val(),
      gender: $('#gender').val(),
      motherLang: $('#motherLang').val()

    };

    console.log(user);

    if( !user.username  || !user.motherLang ){
      flash('Please fill in all fields');
    }else{
      PersonProfiles.insert(user);
      CardinalVowels.insert({owner: Meteor.userId()});
      Sentences.insert({owner: Meteor.userId()});
      Router.go('/');
    }

  }
};