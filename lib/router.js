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
    isLoggedIn: function (pause) {
        if (!(Meteor.loggingIn() || Meteor.user())) {
            console.log("User not logged in, routing to login.");
            Router.go('home');
        } else {
            this.next();
        }

    }

}

Router.onBeforeAction(filters.isLoggedIn, {except: ['start']});

// *** This was the original code from the boiler plate template
// Router.onBeforeAction(filters.myFilter, {only: ['items']});
// *** replaced, but leaving in incase I need it again.


// Routes

Router.map(function () {



    // Pages

    this.route('home', {
        path: '/',
        template: 'home',
    });


    this.route('setup', {
        path: '/setup',
        template: 'setup',
    });

    this.route('sentences/:_id', {
        path: '/sentences/:_id',
        data: function () {
            return {sentenceId: this.params._id}
        },//TODO Filter valid input
        template: 'sentences',
    });


    this.route('calibrate/:_vowel', {
        path: '/calibrate/:_vowel',
        data: function () {
            return {vowel: this.params._vowel};
        },//TODO Filter valid input
        template: 'calibrate',
    });

    this.route('progress', {
        path: '/progress',
        template: 'progress',
    });

});
