import Hooks from "@reactioncommerce/hooks";
import { Job } from "/imports/plugins/core/job-collection/lib";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { Jobs } from "/lib/collections";

/**
 * @summary Add the export job to the queue
 * @param {String} orderId - the id of the Order to export
 * @returns {undefined} undefined
 */
function addExportJob(orderId) {
  new Job(Jobs, "connectors/shopify/export/order", { orderId })
    .priority("normal")
    .retry({
      retries: 5,
      wait: 5000,
      backoff: "exponential"
    }).save();
}


Hooks.Events.add("afterOrderInsert", (doc) => {
  // Ensure we have items
  if (doc && doc.items && Array.isArray(doc.items)) {
    // Get all shopIds represented in this cart
    const shopIdsInCart = doc.items.map((item) => item.shopId);

    // get the unique set of shopIds in this cart
    const uniqueShopIds = [...new Set(shopIdsInCart)];

    // For each shopid check to see if there are synchooks are respond appropriately
    uniqueShopIds.forEach((shopId) => {
      const shopifyPkg = Reaction.getPackageSettingsWithOptions({
        shopId,
        name: "reaction-connectors-shopify"
      });
      if (shopifyPkg) {
        const { settings } = shopifyPkg;
        const { synchooks } = settings;
        if (synchooks) {
          synchooks.forEach((hook) => {
            if (hook.topic === "orders" && hook.event === "orders/create" && hook.syncType === "exportToShopify") {
              addExportJob(doc._id);
            }
          });
        }
      }
    });
  }

  return doc;
});
