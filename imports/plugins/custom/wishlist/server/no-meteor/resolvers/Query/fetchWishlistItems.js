export default async function fetchWishlistItems(_, _, context) {
  return context.queries.fetchWishlistItems(context);
}
