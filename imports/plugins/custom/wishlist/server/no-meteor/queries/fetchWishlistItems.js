import ReactionError from "@reactioncommerce/reaction-error";

/**
 * @name fetchWishlistItems
 * @method
 * @summary Query the Wishlist collection
 * @param {Object} context - an object containing the per-request state
 * @param {String} params.accountId - User's account id
 * @return {Promise<Object>|undefined} - An object with the wishlist's items
 */
export default async function fetchWishlistItems(context, { accountId } = {}) {
  const { collections } = context;

  if (!accountId) {
    throw new ReactionError("invalid-param", "You must provide accountId arguments");
  }
  const { Wishlist, Catalog } = collections;
  console.log(await Catalog.findOne({ _id: "Q8CqHLoY8joobgyZ5" }));
  console.log('DEBUG: fetchWishlistItems -> Wishlist.findOne({ accountId: accountId })', await Wishlist.findOne({ accountId: accountId }));
  return Wishlist.findOne({ accountId: accountId });
}