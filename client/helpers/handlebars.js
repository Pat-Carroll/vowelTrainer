/* ---------------------------------------------------- +/

## Handlebars Helpers ##

Custom Handlebars helpers.

/+ ---------------------------------------------------- */

Template.registerHelper('myHelper', function(myArgument){
  return "Hello, " + myArgument;
});
