import * as Schemas from "./schemas/wishlist"
export const Wishlist = new Mongo.Collection("Wishlist");

Wishlist.attachSchema(Schemas.Wishlist);
Wishlist.attachSchema(Schemas.WishlistItem);
