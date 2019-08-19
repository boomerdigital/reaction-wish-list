/* eslint-disable require-jsdoc */
import ReactionError from "@reactioncommerce/reaction-error";
import {
  WishlistItem as WishlistItemSchema,
  Wishlist as WishlistSchema
} from "/imports/plugins/custom/wishlist/lib/collections/schemas";
import hashLoginToken from "/imports/node-app/core/util/hashLoginToken";
import Random from "@reactioncommerce/random";

function createWishlist(Wishlist, { userId, items }) {
  return Wishlist.insert({
    _id: Random.id(),
    userId,
    items: [items]
  }).then(() => Wishlist.findOne({ userId }));
}

function updateWishlist(Wishlist, { userId, items }) {
  return Wishlist.updateOne(
    { userId },
    {
      $addToSet: { items }
    }
  ).then(() => Wishlist.findOne({ userId }));
}

async function addToWishlist(Wishlist, { userId, items }) {
  const aWishlist = await Wishlist.findOne({ userId });

  if (!aWishlist) return createWishlist(Wishlist, { userId, items });

  // if (matchedCount !== 1) throw new ReactionError("server-error", "Unable to update cart");

  return updateWishlist(Wishlist, { userId, items });
}

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
  const { productId, variantId } = input;
  const { collections, userId = null } = context;
  const { Wishlist, Accounts } = collections;

  const userAccount = await Accounts.findOne({ userId });
  if (!userAccount) throw new ReactionError("not-found", "No account found");

  const itemPayload = { productId, variantId, _id: Random.id() };
  console.log("DEBUG: addProductToWishlist -> itemPayload", itemPayload);
  WishlistItemSchema.validate(itemPayload);

  // const aWishlist = await addToWishlist(Wishlist, { userId: "wQe3CvFk4J3tcQCwB", items: itemPayload });

  return addToWishlist(Wishlist, { userId: "wQe3CvFk4J3tcQCwB", items: itemPayload });
}
