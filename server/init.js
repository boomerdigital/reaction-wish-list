import { Meteor } from "meteor/meteor";
import { Wishlist } from "../lib/collections";
import { Hooks, Reaction, Logger } from "/server/api";

Meteor.users.after.insert(function (userId, doc) {
  if ( doc.emails.length != 0 ) {
    Logger.info("::: Creating wishlist for user: #" + doc._id);
    return Wishlist.insert({ userId: doc._id });
  }
});
