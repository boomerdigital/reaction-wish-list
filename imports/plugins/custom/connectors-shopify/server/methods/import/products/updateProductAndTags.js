import Logger from "@reactioncommerce/logger";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { Products } from "/lib/collections";
import { saveTags } from "./saveTags";
/**
 * Update product feilds and tags from shopify
 * @private
 * @method updateProductAndTags
 * @param {*} { product, shopifyProduct, shopify, shopId, tagCache }
 * @return {undefined}
 */
export async function updateProductAndTags({ product, shopifyProduct, shopify, shopId, tagCache }) {
  Logger.info("Updating product and tags...");
  const hashtags = await saveTags({ shopify, shopifyProduct, shopId, tagCache });
  const tags = shopifyProduct.tags.split(",").map(Reaction.getSlug);
  Products.update({
    _id: product._id
  }, {
    $set: {
      ancestors: [],
      description: shopifyProduct.body_html,
      handle: shopifyProduct.handle,
      hashtags,
      isVisible: true,
      pageTitle: shopifyProduct.pageTitle,
      productType: shopifyProduct.product_type,
      shopifyId: shopifyProduct.id.toString(),
      tags
    }
  }, { selector: { type: "simple" }, publish: true });
}
