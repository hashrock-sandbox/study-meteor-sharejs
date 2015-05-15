Documents = new Meteor.Collection("documents")

if (Meteor.isClient) {
  Session.setDefault('editingDocId', "");
  Template.kanban.helpers({
    /*
    tasks: function(){
      console.log(Documents.findOne(this._id).tasks);
      return Documents.findOne(this._id).tasks;
    }
    */
  });


  Template.hello.helpers({
    isPlain: function(){
      return this.doctype === "plain";
    },
    isKanban: function(){
      return this.doctype === "kanban";
    },
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
        text: "",
        doctype: "plain"
      });
    },
    'click #addKanban': function () {
      Documents.insert({
        text: "",
        doctype: "kanban"
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
    },
    'submit .addTaskForm': function(event){
        event.preventDefault();
        var taskName = event.target.taskName.value;
        var task = {
          name: taskName
        }
        console.log(this._id);
        var item = Documents.findOne(this._id);
        if(!item.tasks){
          item.tasks = [];
        }
        item.tasks.push(task);

        Documents.update(
          {_id: this._id},
          {$set: {
            tasks: item.tasks
          }}
        )
        // Clear form
        event.target.taskName.value = "";
        return false;
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
