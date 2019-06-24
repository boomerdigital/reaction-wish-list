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
  // Where does addEmail come from? Can we do this with the other fields?
  MeteorAccounts.addEmail(user._id, email);

  return true;
}
