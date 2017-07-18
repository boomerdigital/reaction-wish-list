import { Mongo } from "meteor/mongo";
import * as Schemas from "./schemas";

export const Wishlist = new Mongo.Collection("Wishlist");

Wishlist.attachSchema(Schemas.Wishlist);

export const WishlistItem = new Mongo.Collection("WishlistItem");
WishlistItem.attachSchema(Schemas.WishlistItem);
