/* eslint-disable valid-jsdoc */
/**
 * @name "Mutation.addProductToWishlist"
 * @method
 * @memberof Cart/GraphQL
 * @summary resolver for the addCartItems GraphQL mutation
 * @param {Object} parentResult - unused
 * @param {Object} args.input - an object of all mutation arguments that were sent by the client
 * @param {String} args.input.variantId - The opaque ID of the cart to add the items to.
 * @param {String} args.input.productId - An array of cart items to add to the new cart. Must not be empty.
 * @param {String} [args.input.token] - The anonymous access token that was returned from `createCart`.
 *   Required for anonymous carts.
 * @param {Object} context - an object containing the per-request state
 * @return {Promise<Object>} AddCartItemsPayload
 */
export default function addProductToWishlist(parentResult, { input }, context) {
  const { clientMutationId = null, productId, variantId } = input;


  return context.mutations.addProductToWishlist(context, {
    productId,
    variantId
  }).then((wishlist) =>
    ({ wishlist, clientMutationId }));
}
