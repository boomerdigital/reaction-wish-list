/* eslint-disable require-jsdoc */
import { decodeAccountOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/account";

export default async function updateAccountEntry(parentResult, { input }, context) {
  const {
    clientMutationId = null,
    accountId: opaqueAccountId,
    updates: {
      primaryEmailAddress,
      firstName,
      lastName,
      birthDate
    }
  } = input;

  const accountId = decodeAccountOpaqueId(opaqueAccountId);

  const account = await context.mutations.updateAccount(context, {
    accountId,
    primaryEmailAddress,
    firstName,
    lastName,
    birthDate
  });

  return {
    clientMutationId,
    account
  };
}
