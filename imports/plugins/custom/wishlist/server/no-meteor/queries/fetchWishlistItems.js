import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @name fetchWishlistItems
 * @method
 * @summary Query the Wishlist collection
 * @param {Object} context - an object containing the per-request state
 * @param {String} params.accountId - User's account id
 * @return {Promise<Object>|undefined} - An object with the wishlist's items
 */
export default async function fetchWishlistItems(context) {
  context.userId = "wQe3CvFk4J3tcQCwB";

  const { collections, userId } = context;
  const { Wishlist, Accounts } = collections;

  const userAccount = await Accounts.findOne({ userId });
  if (!userAccount) throw new ReactionError("not-found", "No account found");

  return Wishlist.findOne({ userId });
}