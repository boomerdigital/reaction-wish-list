import { decodeShopOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/shop";
import { decodeAccountOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/account";

export default async function updateAccountEntry(parentResult, { input }, context) {
  const {
    clientMutationId = null,
    id: opaqueAccountId,
    shopId: opaqueShopId,
    firstName,
    lastName,
    birthDate
  } = input;

  const shopId = decodeShopOpaqueId(opaqueShopId);
  const accountId = decodeAccountOpaqueId(opaqueAccountId);

  const account = await context.mutations.updateAccount(context, {
    shopId,
    accountId,
    firstName,
    lastName,
    birthDate
  });

  return {
    clientMutationId,
    account
  };
}
