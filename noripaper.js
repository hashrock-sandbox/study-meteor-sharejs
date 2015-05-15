Documents = new Meteor.Collection("documents")

if (Meteor.isClient) {
  Session.setDefault('editingDocId', "");

  Template.hello.helpers({
    documents: function(){
      return Documents.find();
    },
    editingDocId: function(){
      return Session.get('editingDocId');
    },
    isEditing: function(){
      return Session.get('editingDocId') !== "";
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
        return getSnapshot(docid).snapshot;
      }
  });
  /*
  Meteor.startup(function () {
  });
  */
}
