import ReactionError from "@reactioncommerce/reaction-error";


export default async function updateAccount(context, input, accountUserId) {
  const { collections, userHasPermission, userId: userIdFromContext } = context;
  const { Accounts } = collections;
  const { primaryEmailAddress, firstName, lastName, birthDate } = input;
  const userId = accountUserId || userIdFromContext;
  const account = await Accounts.findOne({ userId });

  if (!account) throw new ReactionError("not-found", "No account found");

  const { value: updatedAccount } = await Accounts.findOneAndUpdate(
    { userId },
    { $set: {
      "emails.0.address": primaryEmailAddress, firstName, lastName, birthDate
    }
  });

  if (!updatedAccount) {
    throw new ReactionError("server-error", "Unable to add address to account");
  }

  return updatedAccount;
}