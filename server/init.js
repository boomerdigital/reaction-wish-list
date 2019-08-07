import Logger from "@reactioncommerce/logger";
import { Meteor } from "meteor/meteor";
import { Wishlist } from "/lib/collections";

Meteor.users.after.insert(function (userId, doc) {
  if ( doc.emails.length != 0 ) {
    Logger.info("::: Creating wishlist for user: #" + doc._id);
    Wishlist.insert({ userId: doc._id })
  }
});
