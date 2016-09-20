// Set up a collection to contain parking information. On the server,
// it is backed by a MongoDB collection named "parking".

Parking = new Mongo.Collection("parking");

if (Meteor.isClient) {
  Template.parking.helpers({
    areas: function () {
      return Parking.find({}, { sort: { places: -1, name: 1 } });
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
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Parking.find().count() === 0) {
      var names = ["P1", "P2", "P3",
                   "P4", "P5", "P6",
                   "P7", "P8", "P9",
                   "P10", "VP - Karakaari", "VP - Karaportti"];
      _.each(names, function (name) {
        Parking.insert({
          name: name,
          places: Math.floor(Random.fraction() * 10) * 2
        });
      });
    }
  });
}
