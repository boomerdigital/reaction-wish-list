export default async function fetchWishlistItems(_, args, context) {
  const { accountId } = args;

  return context.queries.fetchWishlistItems(context, { accountId });
}
