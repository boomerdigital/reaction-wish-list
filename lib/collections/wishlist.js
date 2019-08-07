import SimpleSchema from "simpl-schema";
import { registerSchema } from "@reactioncommerce/schemas";

/**
 * OrderItems Schema
 * merges with Cart and Order to create Orders collection
 */
export const WishListItem = new SimpleSchema({
  productId: {
    type: String,
    optional: false
  },
  variantId: {
    type: String,
    optional: true
  },
  title: {
    // Why do we want this?
    type: String,
    defaultValue: "",
    label: "Product Title"
  }
});

/**
 * Order Schema
 */
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
    type: Array
  },
  "items.$": {
    type: WishListItem,
  }
});

registerSchema("Wishlist", Wishlist);
registerSchema("WishListItem", WishListItem);
