import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import { Reaction, Logger } from "/server/api";

Tracker.autorun(() => {
  Logger.info(this);
  Reaction.Subscriptions.Wishlist = Meteor.subscribe("Wishlist", Meteor.userId());
});
