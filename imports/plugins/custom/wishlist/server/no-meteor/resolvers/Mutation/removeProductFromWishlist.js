/* eslint-disable valid-jsdoc */
/**
 * @name "Mutation.removeProductFromWishlist"
 * @method
 * @summary resolver for the removeProductFromWishlist GraphQL mutation
 * @param {Object} parentResult - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {String} args.input.itemId - The opaque ID of the cart to add the items to.
 * @param {Object} context - an object containing the per-request state
 * @return {Promise<Object>} AddCartItemsPayload
 */
export default async function removeProductFromWishlist(parentResult, { input }, context) {
  const { itemId } = input;

  return context.mutations.removeProductFromWishlist(context, {
    itemId
  });
}
