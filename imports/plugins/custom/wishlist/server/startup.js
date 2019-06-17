import { Mongo } from "meteor/mongo";
import { Wishlist as WishlistSchema } from "../lib/collections/schemas";

export default function startup() {
  /**
   * @name Wishlist
   * @memberof Collections
   * @type {MongoCollection}
   */
  const Wishlist = new Mongo.Collection("Wishlist");
  
  Wishlist.attachSchema(WishlistSchema);
}
