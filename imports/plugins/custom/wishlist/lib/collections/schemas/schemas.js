import SimpleSchema from "simpl-schema";
import Random from "@reactioncommerce/random";
import { registerSchema } from "@reactioncommerce/schemas";

export const WishlistItem = new SimpleSchema({
  _id: {
    type: String,
    unique: true,
    defaultValue: Random.id(),
    optional: true
  },
  productId: {
    type: String,
    optional: false
  },
  variantId: {
    type: String,
    optional: true
  },
  title: {
    type: String,
    defaultValue: "",
    optional: true
  }
});

registerSchema("WishlistItem", WishlistItem);

export const Wishlist = new SimpleSchema({
  "_id": {
    type: String
  },
  "userId": {
    type: String,
    unique: true
  },
  "items": {
    type: Array
  },
  "items.$": {
    type: WishlistItem
  }
});

registerSchema("Wishlist", Wishlist);
