import SimpleSchema from "simpl-schema";
import { check } from "meteor/check";
import { Tracker } from "meteor/tracker";
import { Tags } from "/lib/collections";
import { registerSchema } from "@reactioncommerce/schemas";


const RulesAttribute = new SimpleSchema({
  column: {
    type: String,
    optional: true
  },
  relation: {
    type: String,
    optional: true
  },
  condition: {
    type: String,
    optional: true
  }
});
/**
 * @file ShopifyTag
 *
 * @module connectors-shopify
 */

/**
 * @name ShopifyTag
 * @memberof Schemas
 * @type {SimpleSchema}
 * @summary ShopifyTag schema attached to Tags
 * @property {Number} shopifyId Shopify ID
 */
export const ShopifyTag = new SimpleSchema({
  // stores shopify collection sortOrder which can be used to control default sorting of products for this tag
  "sortOrder": {
    type: String,
    optional: true
  },
  // stores Shopify `body_html` property data
  "description": {
    type: String,
    optional: true
  },
  // stores shopify collection rules to handle tag searches
  "rules": {
    type: Array,
    optional: true
  },

  "rules.$": RulesAttribute
}, { check, tracker: Tracker });

registerSchema("ShopifyTag", ShopifyTag);

Tags.attachSchema(ShopifyTag);
