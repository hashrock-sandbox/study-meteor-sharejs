Documents = new Meteor.Collection("documents")

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    },
    documents: function(){
      return Documents.find();
    }
  });
  
  Template.hello.config = function(){
    return function(cm){
      cm.setOption("theme", "default")
      cm.setOption("lineNumbers", true)
      cm.setOption("lineWrapping", true)
      cm.setOption("smartIndent", true)
      cm.setOption("indentWithTabs", true)
      cm.setOption("defaultTextHeight", 100);
    }
  }

  Template.hello.events({
    'click #addNew': function () {
      Documents.insert({
        text: "HEllo!"
      })
      // increment the counter when button is clicked
      //Session.set('counter', Session.get('counter') + 1);
    },
    'click .remove': function () {
      Documents.remove(this._id);
      // increment the counter when button is clicked
      //Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
