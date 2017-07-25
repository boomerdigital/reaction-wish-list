import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Wishlist, WishlistItem } from "../../lib/collections";


export function createWishlist(userId) {
  const wishlistId = Wishlist.insert({ userId: userId });
  return Wishlist.findOne({ _id: wishlistId })
}

Meteor.methods({
  createWishlist: function(userId) {
    check(userId, String);
    Wishlist.insert({ userId: userId });
  },

  addToWishlist: function(userId, productId, variantId) {
    check(userId, String);
    check(productId, String);
    check(variantId, Match.Optional(String));

    let aWishlist = Wishlist.findOne({ userId: userId });

    // Check if the wishlist already has the item

    return Wishlist.update({
      _id: aWishlist._id
    },  {
      $push: {
        items: {
          _id: Random.id(),
          productId: productId,
          variantId: variantId
        }
      }
    });
  },

  removeFromWishlist: function(userId, productId, variantId) {
    check(userId, String);
    check(productId, String);
    check(variantId, Match.Optional(String));

    let aWishlist = Wishlist.findOne({ userId: userId });

    return Wishlist.update({
      _id: aWishlist._id
    },  {
      $pull: {
        items: {
          productId: productId,
          variantId: variantId
        }
      }
    });
 },
 getWishlist: function(userId) {
    check(userId, String);

    return Wishlist.findOne({ userId: userId });
  },

  findWishlistByItems: function(userId, productId, variantId) {
    check(userId, String);
    check(productId, String);
    check(variantId, Match.Optional(String));

    const currentWishlist = Wishlist.findOne({
      userId: userId,
      items: {
        productId: productId,
        variantId: variantId
      }
    });
    console.log(currentWishlist)
    return currentWishlist;
  },

  hasWishedItem: function(userId, productId, variantId) {
    check(userId, String);
    check(productId, String);
    check(variantId, Match.Optional(String));

    const currentWishlist = Wishlist.findOne({
      userId: userId,
      items: {
        productId: productId,
        variantId: variantId
      }
    });

    if (currentWishlist) {
      return true;
    } else {
      return false;
    }
  }

});
