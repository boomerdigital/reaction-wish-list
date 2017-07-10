import { Meteor } from "meteor/meteor";
import { Wishlist } from "/lib/collections";
import { Hooks, Reaction, Logger } from "/server/api";

Meteor.users.after.insert(function (userId, opts) {
  Logger.info("::: Creating wishlist for user: #" + userId);

  if (userId && Reaction.Subscriptions.Wishlist.ready()) {
    Logger.info("Inside userId");
    const response = Reaction.Subscriptions.Wishlist = Meteor.subscribe("Wishlist", userId);
    Logger.info(response);
  }
});
