import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";

export const Wishlist = new Mongo.Collection("Wishlist");

Wishlist.attachSchema([
  Schemas.Wishlist,
  Schemas.WishlistItem
]);
