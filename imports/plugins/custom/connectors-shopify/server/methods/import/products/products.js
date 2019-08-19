/* eslint camelcase: 0 */
import Logger from "@reactioncommerce/logger";
import Shopify from "shopify-api-node";
import { Meteor } from "meteor/meteor";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { check, Match } from "meteor/check";
import { Products } from "/lib/collections";
import { getApiInfo } from "../../api/api";
import { connectorsRoles } from "../../../lib/roles";
import { importImages } from "../../../jobs/image-import";
import { saveProduct } from "./saveProduct";
import { saveTags, createTagCache, creatParentTags } from "./saveTags";
import { updateProductAndTags } from "./updateProductAndTags";

export const methods = {
  /**
   * Imports products for the active Reaction Shop from Shopify with the API credentials setup for that shop.
   *
   * @async
   * @method connectors/shopify/import/products
   * @param {object} options An object of options for the shopify API call. Available options here: https://help.shopify.com/api/reference/product#index
   * @returns {array} An array of the Reaction product _ids (including variants and options) that were created.
   */
  async "connectors/shopify/import/products"(options) {
    check(options, Match.Maybe(Object));
    if (!Reaction.hasPermission(connectorsRoles)) {
      throw new Meteor.Error("access-denied", "Access Denied");
    }

    const apiCreds = getApiInfo();
    const shopify = new Shopify(apiCreds);
    const shopId = Reaction.getShopId();
    const limit = 50; // Shopify returns a maximum of 250 results per request
    const tagCache = createTagCache();
    const ids = [];
    const opts = Object.assign(
      {},
      {
        published_status: "published",
        limit
      },
      { ...options }
    );

    try {
      const productCount = await shopify.product.count();
      const numPages = Math.ceil(productCount / limit);
      const pages = [...Array(numPages).keys()];
      Logger.info(`Shopify Connector is preparing to import ${productCount} products`);

      // createParentTags before starting import
      creatParentTags({ shopId });

      for (const page of pages) {
        Logger.info(`Importing page ${page + 1} of ${numPages} - each page has ${limit} products`);
        const shopifyProducts = await shopify.product.list({ ...opts, page }); // eslint-disable-line no-await-in-loop
        for (const shopifyProduct of shopifyProducts) {
          const product = Products.findOne({ shopifyId: shopifyProduct.id }, { fields: { _id: 1 } });
          if (!product) {
            Logger.debug(`Importing ${shopifyProduct.title}`);

            // eslint-disable-next-line no-await-in-loop
            const hashtags = await saveTags({ shopify, shopifyProduct, shopId, tagCache });
            saveProduct({ shopifyProduct, shopId, ids, hashtags });

            Logger.debug(`Product ${shopifyProduct.title} added`);
          } else {
            // Update existing product fields and tags
            // updateProductAndTags({ product, shopifyProduct, shopify, shopId, tagCache });

            Logger.debug(`Product ${shopifyProduct.title} already exists`);
          }
        } // End product loop
      } // End pages loop
      Logger.info(`Reaction Shopify Connector has finished importing ${ids.length} products and variants`);

      // Run jobs to import all queued images;
      importImages();
      return ids;
    } catch (error) {
      Logger.error("There was a problem importing your products from Shopify", error);
      throw new Meteor.Error("There was a problem importing your products from Shopify", error);
    }
  }
};

Meteor.methods(methods);
