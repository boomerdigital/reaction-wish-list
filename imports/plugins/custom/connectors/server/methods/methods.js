import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Packages } from "/lib/collections";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { connectorsRoles } from "../lib/roles";

/**
 *
 * @namespace Connectors/Methods
 */

export const methods = {
  /**
   * @name connectors/connection/toggle
   * @method
   * @memberof Connectors/Methods
   * @example Meteor.call("connectors/connection/toggle", packageId, settingsKey)
   * @summary Toggle enabled connection
   * @param { String } packageId - packageId
   * @param { String } connection - connection name
   * @return { Number } update - result
   */
  "connectors/connection/toggle"(packageId, connection) {
    check(packageId, String);
    check(connection, String);
    if (!Reaction.hasPermission(connectorsRoles)) {
      throw new Meteor.Error("access-denied", "Access Denied");
    }
    const pkg = Packages.findOne(packageId);
    if (pkg && pkg.settings[connection]) {
      // const enabled = pkg.settings[connection].enabled;
    }
  }
};

Meteor.methods(methods);
