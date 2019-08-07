import { Meteor } from "meteor/meteor";
import * as WishlistMethods from "./wishlistMethods";

Meteor.methods({
  createWishlist: WishlistMethods.createWishlist,
  addToWishlist: WishlistMethods.addToWishlist,
  removeFromWishlist: WishlistMethods.removeFromWishlist,
  getWishList: WishlistMethods.getWishlist
});
