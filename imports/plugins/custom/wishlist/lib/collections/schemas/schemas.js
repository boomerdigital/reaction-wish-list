import SimpleSchema from "simpl-schema";
import { registerSchema } from "@reactioncommerce/schemas";

export const WishlistItem = new SimpleSchema({
  catalogItem: String,
  variant: {
    type: String,
    optional: true
  }
});

registerSchema("WishlistItem", WishlistItem);

export const Wishlist = new SimpleSchema({
  accountId: {
    type: String,
    unique: true
  },
  items: [WishlistItem],
  updatedAt: Date
});

registerSchema("Wishlist", Wishlist);
