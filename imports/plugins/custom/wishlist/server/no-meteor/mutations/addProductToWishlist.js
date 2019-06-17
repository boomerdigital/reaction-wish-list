import ReactionError from "@reactioncommerce/reaction-error";
import { WishlistItem as WishlistItemSchema, Wishlist as WishlistSchema } from "/imports/plugins/custom/wishlist/lib/collections/schemas";
import hashLoginToken from "/imports/node-app/core/util/hashLoginToken";

/**
 * @method addProductToWishlist
 * @summary Add one product to wishlist
 * @param {Object} context -  an object containing the per-request state
 * @param {Object} input - mutation input
 * @param {Object} [options] - Options
 * @param {Boolean} [options.skipPriceCheck] - For backwards compatibility, set to `true` to skip checking price.
 *   Skipping this is not recommended for new code.
 * @return {Promise<Object>} An object with `cart`, `minOrderQuantityFailures`, and `incorrectPriceFailures` properties.
 *   `cart` will always be the full updated cart document, but `incorrectPriceFailures` and
 *   `minOrderQuantityFailures` may still contain other failures that the caller should
 *   optionally retry with the corrected price or quantity.
 */
export default async function addProductToWishlist(context, input, options = {}) {
  const { catalogItem, variant } = input;
  const { appEvents, collections, accountId = null, userId = null } = context;
  const { Wishlist } = collections;

  if (!accountId) {
    throw new ReactionError("not-found", "User not logged in");
  }

  const itemPayload = { catalogItem, variant };
  console.log('DEBUG: addProductToWishlist -> itemPayload', itemPayload);
  WishlistItemSchema.validate(itemPayload);

  let wl = await Wishlist.findOne({ accountId: accountId });
  if (!wl) {
    // Create new wishlist
    wl = await Wishlist.insert({ accountId, items: [itemPayload] })
  } else {
    // Proceed to add items to wishlist
    const updatedAt = new Date();
  
    const modifier = {
      $set: {
        items: [...wl.items, itemPayload],
        updatedAt
      }
    };
    WishlistSchema.validate(modifier, { modifier: true });
  
    const { matchedCount } = await Wishlist.updateOne({ accountId: accountId }, modifier);
    if (matchedCount !== 1) throw new ReactionError("server-error", "Unable to update cart");
  }

  // await appEvents.emit("afterCartUpdate", {
  //   cart: updatedCart,
  //   updatedBy: userId
  // });

  return wl;
}
