import { Meteor } from "meteor/meteor";
import { Accounts as MeteorAccounts } from "meteor/accounts-base";
import { check } from "meteor/check";

/**
 * @name accounts/updateAccountInformation
 * @memberof Accounts/Methods
 * @method
 * @summary Update a user's email address
 * @param {String} email - user email
 * @returns {Boolean} - return True on success
 */
export default function updateUserInformation(email, firstName, lastName, birthDate) {
  check(email, Match.Optional(String));
  check(firstName, Match.Optional(String));
  check(lastName, Match.Optional(String));
  check(birthDate, Match.Optional(Date));
  const user = Meteor.user();

  //
  const userUpdateQuery = {
    $set: {
      "emails.address": email,
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
