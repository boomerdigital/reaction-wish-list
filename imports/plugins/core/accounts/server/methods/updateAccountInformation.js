import { Meteor } from "meteor/meteor";
import { Accounts as MeteorAccounts } from "meteor/accounts-base";
import { check } from "meteor/check";

export default function updateUserInformation(primaryEmailAddress, firstName, lastName, birthDate) {
  check(primaryEmailAddress, Match.Optional(String));
  check(firstName, Match.Optional(String));
  check(lastName, Match.Optional(String));
  check(birthDate, Match.Optional(Date));
  const user = Meteor.user();

  console.log(primaryEmailAddress)
  const userUpdateQuery = {
    $set: {
      "emails.0.address": primaryEmailAddress,
      "firstName": firstName,
      "lastName": lastName,
      "birthDate": birthDate
    }
  };

  Meteor.users.update({ _id: user._id }, userUpdateQuery);
  const updatedAccountResult = Accounts.update({
    userId
  }, userUpdateQuery);

  if (updatedAccountResult !== 1) {
    throw new ReactionError("server-error", "Unable to update account address");
  }
  return true;
}
