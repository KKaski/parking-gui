// Set up a collection to contain parking information. On the server,
// it is backed by a MongoDB collection named "parking".

Parking = new Mongo.Collection("parking");

if (Meteor.isClient) {
  Template.parking.helpers({
    areas: function () {
      return Parking.find({}, { sort: { order: 1, name: 1 } });
    },
    selectedArea: function () {
      var area = Parking.findOne(Session.get("selectedArea"));
      return area && area.name;
    }
  });

  Template.parking.events({
    'click .inc': function () {
      Parking.update(Session.get("selectedArea"), {$inc: {places: 1}});
    }
  });

  Template.parking.events({
    'click .dec': function () {
      Parking.update(Session.get("selectedArea"), {$inc: {places: -1}});
    }
  });

  Template.area.helpers({
    selected: function () {
      return Session.equals("selectedArea", this._id) ? "selected" : '';
    }
  });

  Template.area.events({
    'click': function () {
      Session.set("selectedArea", this._id);
    }
  });

   Template.map.helpers({
    spaces:function () {
      var area = Parking.findOne({name: this.place});
      console.log("Getting Area: "+this.place+" places:"+area.places);
      return area;
    }
    });

  Template.marker.helpers({
    free:function () {
      var area = Parking.findOne({name: this.place});
      var result = area.places>0?'free':'';
      console.log("Getting Area2: "+this.place+" places:"+result);
      return result;
    }
    });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Parking.find().count() === 0) {
      var count=0;
      var names = ["P3", "P5", "P10"];
      _.each(names, function (name) {
        count++;
        Parking.insert({
          name: name,
          order: count,
          places: Math.floor(Random.fraction() * 10) * 2
        });
      });
    }
  });
}
