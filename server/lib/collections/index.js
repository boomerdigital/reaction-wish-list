import * as Schemas from "./schemas/wishlist"
import './wishlist-subscription';
export const Wishlist = new Mongo.Collection("Wishlist");

Wishlist.attachSchema(Schemas.Wishlist);
Wishlist.attachSchema(Schemas.WishlistItem);
