import { Meteor } from "meteor/meteor";
import { Wishlist } from "../../../lib/collections";
import { Template } from "meteor/templating";

Template.accountWishlist.helpers({
  wishlist() {
    return Wishlist.findOne({ userId: Meteor.userId() });
  }
});
