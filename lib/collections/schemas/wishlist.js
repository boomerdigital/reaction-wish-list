import { SimpleSchema } from "meteor/aldeed:simple-schema";
import * as Collections from "../collections";

export const WishlistItem = new SimpleSchema({
  productId: {
    type: String,
    optional: false
  },
  variantId: {
    type: String,
    optional: true
  }
});

export const Wishlist = new SimpleSchema({
  Id: {
    type: String,
    optional: true
  },
  userId: {
    type: String,
    unique: true
  },
  items: {
    type: [WishlistItem],
    optional: true
  }
});
