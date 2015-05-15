Documents = new Meteor.Collection("documents")
Docs = new Meteor.Collection("docs")





if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('editingDocId', "");

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    },
    documents: function(){
      return Documents.find();
    },
    editingDocId: function(){
      return Session.get('editingDocId');
    },
    isEditing: function(){
      return Session.get('editingDocId') !== "";
      
      //return Session.get('editingDocId') === this._id;
    },
    config: function(){
      return function(cm){
        cm.setOption("theme", "default")
        cm.setOption("lineNumbers", true)
        cm.setOption("lineWrapping", true)
        cm.setOption("smartIndent", true)
        cm.setOption("indentWithTabs", true)
        cm.setOption("defaultTextHeight", 100);
        cm.on("change", function(evt){
          var id = Session.get('editingDocId');
          Meteor.call("getDocumentText", id, function(err, snapshot){
            Documents.update(
              {_id: id},
              {$set: {text: snapshot}}
            )
          });
        });
      }
    }
  });
  
  Template.hello.events({
    'click #addNew': function () {
      Documents.insert({
        text: ""
      });
    },
    'click .remove': function () {
      Documents.remove(this._id);
    },
    'click .edit': function () {
      Session.set('editingDocId', this._id);
    },
    'click .endedit': function (evt) {
      var id = Session.get('editingDocId');
      Meteor.call("getDocumentText", id, function(err, snapshot){
        console.log(id);
        console.log(snapshot);
        Documents.update(
          {_id: id},
          {$set: {text: snapshot}}
        )
        Session.set('editingDocId', "");
      });
    }
  });
}


if (Meteor.isServer) {
  Meteor.methods({
      getDocumentText: function (docid) {
        var getSnapshot = Meteor.wrapAsync(ShareJS.model.getSnapshot);
        var doc = getSnapshot(docid);
        return doc.snapshot;
      }
  });
  /*
  Meteor.startup(function () {
  });
  */
}
