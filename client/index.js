import { Router, Logger } from "/client/api";
import { Meteor } from 'meteor/meteor';

import "./templates/wishlist/wishlistItems.html";
import "./templates/wishlist/wishlistItems";
import "./templates/wishlist/wishlist.html";
import "./templates/wishlist/wishlist";
import "./templates/accounts/profile/profile.html";
import "./templates/accounts/profile/profile";
import "./components"
import "./containers"


Meteor.startup(() => {
  Meteor.subscribe("wishlist", Meteor.userId());
});
