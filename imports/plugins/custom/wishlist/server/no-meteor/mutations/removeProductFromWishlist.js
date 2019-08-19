import ReactionError from "@reactioncommerce/reaction-error";
import { WishlistItem as WishlistItemSchema, Wishlist as WishlistSchema } from "/imports/plugins/custom/wishlist/lib/collections/schemas";
import hashLoginToken from "/imports/node-app/core/util/hashLoginToken";


// eslint-disable-next-line require-jsdoc
export function removeFromWishlist(Wishlist, { userId, itemId }) {
  check(userId, String);
  check(itemId, String);

  return Wishlist.update(
    {
      userId
    },
    {
      $pull: {
        items: {
          _id: itemId
        }
      }
    }
  ).then(() => ({ itemId }));
}


/**
 * @method removeProductFromWishlist
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
export default async function removeProductFromWishlist(context, input) {
  const { itemId } = input;

  // DEBUG: remove this line
  context.userId = "wQe3CvFk4J3tcQCwB";

  const { collections, userId } = context;
  const { Wishlist, Accounts } = collections;

  const userAccount = await Accounts.findOne({ userId });
  if (!userAccount) throw new ReactionError("not-found", "No account found");

  const aWishlist = await Wishlist.findOne({ userId });

  if (!aWishlist) throw new ReactionError("server-error", "No Wishlist found");

  return removeFromWishlist(Wishlist, { userId, itemId }).then((data) => {
    console.log({ data });
    return data;
  });
}
