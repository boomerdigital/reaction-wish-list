import "./methods";
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Wishlist } from "../../lib/collections";

Meteor.startup(() => {

  Meteor.publish("wishlist", function(userId) {
    check(userId, String);
    return Wishlist.find({ userId: userId });
  });

});
