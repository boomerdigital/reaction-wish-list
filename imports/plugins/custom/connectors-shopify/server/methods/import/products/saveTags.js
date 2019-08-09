/* eslint-disable camelcase */
import { Meteor } from "meteor/meteor";
import Reaction from "/imports/plugins/core/core/server/Reaction";
import { Tags } from "/lib/collections";
import { parentTags } from "../../../lib/tags";
import { saveImage } from "./saveImage";
import { inspect } from "util";

/**
 * Identify and save all the shopify tags for given product
 * @private
 * @method saveTags
 * @param {*} { shopify, shopifyProduct, shopId, tagCache }
 * @return {*} hashtags for product
 */
export async function saveTags({ shopify, shopifyProduct, shopId, tagCache }) {
  // Get tags from shopify and register them if they don't exist.
  // push tag Id's into our hashtags array for use in the product
  // We can't load all tags beforehand because Shopify doesn't have a tags API
  const hashtags = [];
  const tags = shopifyProduct.tags.split(",").map((tag) => ({
    title: tag,
    handle: Reaction.getSlug(tag.replace(/[.]+/g, " ")),
    updated_at: new Date(),
    published_at: new Date()
  }));
  // eslint-disable-next-line no-await-in-loop
  const smartTags = await shopify.smartCollection.list({
    product_id: shopifyProduct.id,
    limit: 250
  });
  // eslint-disable-next-line no-await-in-loop
  const customTags = await shopify.customCollection.list({
    product_id: shopifyProduct.id,
    limit: 250
  });
  const shopifyTags = [...tags, ...customTags, ...smartTags];
  for (const shopifyTag of shopifyTags) {
    const normalizedTag = {
      displayTitle: shopifyTag.title,
      heroMediaUrl: shopifyTag.image && shopifyTag.image.src,
      name: shopifyTag.title,
      rules: shopifyTag.rules,
      slug: shopifyTag.handle,
      sortOrder: shopifyTag.sort_order,
      shopId,
      isTopLevel: false,
      updatedAt: shopifyTag.updated_at,
      createdAt: shopifyTag.published_at
    };
    // add tag descriptions
    if (shopifyTag.body_html) {
      normalizedTag.metafields = [
        {
          key: "description",
          value: shopifyTag.body_html,
          namespace: "metatag"
        }
      ];
    }
    // If we have a cached tag for this slug, we don't need to create a new one
    if (!tagCache[normalizedTag.slug]) {

      // this tag doesn't exist, create it, add it to our tag cache
      normalizedTag._id = Tags.insert(normalizedTag);

      // eslint-disable-next-line no-await-in-loop
      findAndupdateParentTag(normalizedTag);

      tagCache[normalizedTag.slug] = normalizedTag._id;
      if (shopifyTag.image) {
        saveImage(shopifyTag.image.src, {
          ownerId: Meteor.userId(),
          tagId: normalizedTag._id,
          shopId
        });
      }
    }
    // push the tag's _id into hashtags from the cache
    hashtags.push(tagCache[normalizedTag.slug]);
  }
  return hashtags;
}

/**
 * cache all existing tags to memory {slug => id} so that when we're importing products we can
 * lookup tags without a database call.
 * @method createTagCache
 * @private
 * @return {object} Dictionary of tag slugs mapping to the associated _id
 * @todo: For apps with large collections of tags (5k+), this may be less desirable than checking each tag against mongo
 *        That would cause each product tag we find to hit the database at least once. We could make this optional
 */
export function createTagCache() {
  return Tags.find({})
    .fetch()
    .reduce((cache, tag) => {
      if (!cache[tag.slug]) {
        cache[tag.slug] = tag._id;
      }
      return cache;
    }, {});
}

// eslint-disable-next-line valid-jsdoc
/**
 *
 * @method createTagCache
 * @private
 * @return {null}
 */
export function creatParentTags({ shopId }) {
  for (const parentTag of parentTags) {
    const tag = Tags.findOne({ slug: parentTag.slug }, { fields: { _id: 1 } });
    const { slug, name, displayTitle } = parentTag;
    if (!tag) {
      Tags.insert({
        displayTitle,
        name,
        slug,
        shopId,
        isTopLevel: true,
        relatedTagIds: []
      });
    }
  }
}

// eslint-disable-next-line valid-jsdoc
/**
 *
 *
 * @param {*} normalizedTag
 * @returns
 */
function findAndupdateParentTag(normalizedTag) {
  for (const parentTag of parentTags) {
    const isBannerTag = parentTag.regex && normalizedTag.slug.match(parentTag.regex);
    if (isBannerTag) {
      return updateParentTag(parentTag.slug, normalizedTag);
    }
    if (!parentTag.subTags) {
      return null;
    }

    for (const subTag of parentTag.subTags) {
      const feildName = Object.keys(subTag)[0];
      const isOtherChildTag = normalizedTag[feildName] === subTag[feildName];
      if (isOtherChildTag) {
        return updateParentTag(parentTag.slug, normalizedTag);
      }
    }
  }
  return null;
}

// eslint-disable-next-line require-jsdoc
function updateParentTag(parentSlug, { _id, shopId }) {
  return Tags.update({ slug: parentSlug, shopId }, {
    $addToSet: {
      relatedTagIds: _id
    }
  });
}
