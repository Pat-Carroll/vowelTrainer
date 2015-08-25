Template.signup.events = {
  'click input[type=submit]': function(event){
    event.preventDefault();

    var user = {
      email: $('#email').val(),
      password: $('#password').val()
    };

    if( !user.email || !user.password){
      flash('Please fill in all fields');
    }else{
      Accounts.createUser(user, function(error){
        if(error){
          flash(error.reason, 'error');
        }else{
          Router.go('/setup');
          flash('Benutzerkonto erfolgreich erstellt!');
        }  
      });
    }

  }
};