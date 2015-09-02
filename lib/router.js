/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

// Filters

var filters = {

  myFilter: function () {
    // do something
  },

  // show login if a guest wants to access private areas
  // Use: {only: [privateAreas] }
  isLoggedIn: function(pause) {
    if (!(Meteor.loggingIn() || Meteor.user())) {
      console.log("User not logged in, routing to login."); 
      Router.go('home');
      this.next();
    } else {
      this.next();
    }

  }

}

Router.onBeforeAction(filters.isLoggedIn, {except: [ 'start']});

// *** This was the original code from the boiler plate template
// Router.onBeforeAction(filters.myFilter, {only: ['items']});
// *** replaced, but leaving in incase I need it again.


// Routes

Router.map(function() {

  // Items

  this.route('items', {
    waitOn: function () {
      return Meteor.subscribe('allItems');
    },
    data: function () {
      return {
        items: Items.find()
      }
    }
  });

  this.route('item', {
    path: '/items/:_id',
    waitOn: function () {
      return Meteor.subscribe('singleItem', this.params._id);
    },
    data: function () {
      return {
        item: Items.findOne(this.params._id)
      }
    }
  });


  // Pages

  this.route('home', {
    path: '/',
    template: 'home',
  });

  // Users


  this.route('setup', {
    path: '/setup',
    template: 'setup',
  });

  this.route('sentences', {
    path: '/sentences',
    template: 'sentences',
  });



  this.route('calibrate',{
    path: '/calibrate',
    template: 'calibrate',
  });

  this.route('progress', {
    path: '/progress',
    template: 'progress',
  });

});
