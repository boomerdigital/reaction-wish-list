import Logger from "@reactioncommerce/logger";
import { Wishlist } from "/lib/collections";
import Hooks from "@reactioncommerce/hooks";


Hooks.Events.run("afterAccountsInsert", (function (userId, doc) {
  if ( doc.emails.length != 0 ) {
    Logger.info("::: Creating wishlist for user: #" + doc._id);
    Wishlist.insert({ userId: doc._id })
  }
}));
