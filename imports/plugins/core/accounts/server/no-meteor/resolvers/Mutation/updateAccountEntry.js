/* eslint-disable require-jsdoc */
import { decodeAccountOpaqueId } from "@reactioncommerce/reaction-graphql-xforms/account";

export default async function updateAccountEntry(parentResult, { input }, context) {
  const {
    clientMutationId = null,
    accountId: opaqueAccountId,
    updates: {
      email,
      firstName,
      lastName,
      birthDate
    }
  } = input;

  const accountId = decodeAccountOpaqueId(opaqueAccountId);

  const account = await context.mutations.updateAccount(context, {
    accountId,
    email,
    firstName,
    lastName,
    birthDate
  });

  return {
    clientMutationId,
    account
  };
}
