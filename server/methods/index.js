import "./wishlist";
import { Meteor } from 'meteor/meteor';
import { Wishlist } from "../../lib/collections";

Meteor.startup(() => {

  Meteor.publish("wishlists", function() {
      return Wishlist.find({});
  });

});
