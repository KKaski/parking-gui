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

  Template.parking.rendered = function() {
     $('.navbar-collapse a').click(function(e){
      console.log("collapse");
      $(".navbar-collapse").collapse('hide');
    });
  };

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
      //console.log("Getting Area: "+this.place+" places:"+area.places);
      return area;
    }
    });

    Template.watson.events({
        'click .inc': function () {
          Session.set("watsondata", {text:'Loading...'});
          console.log("Calling watson parking service");
          Meteor.call('watsonparking',function(err,res){ 
            console.log(res.content);
            var result = JSON.parse(res.content);
            console.log("score:"+result.score+":url:"+result.url);
            result.text='Next';
            Session.set("watsondata", result);
            return result;
      }); 
      }
    });

    Template.watson.helpers({
    watsonparking:function () {
      if(Session.get("watsondata")===undefined)
        return {text:'Next'};

      return Session.get("watsondata");     
    }
    });

  Template.marker.helpers({
    free:function () {
      var area = Parking.findOne({name: this.place});
      var result = area && area.places>0?'free':'';
      console.log("Getting Area2: "+this.place+" places:"+result);
      return result;
    },
    free_low:function () {
      var area = Parking.findOne({name: this.place});
      var result = area.places<5?'free_low':'';
      console.log("Getting Area3: "+this.place+" places:"+result);
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
  
 Meteor.methods({watsonparking: function () {
  this.unblock();
  try {
    console.log("Watsonparking query");
    var result = HTTP.call("GET", "https://parking-nr.mybluemix.net/simulate?output=json",{});
    console.log("Result:"+result);
    return result;
  } catch (e) {
    // Got a network error, time-out or HTTP error in the 400 or 500 range.
    console.log("Exception:"+e);
    return false;
  }
}}); 

}
