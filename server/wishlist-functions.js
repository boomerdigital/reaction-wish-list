import { Meteor } from "meteor/meteor";
import { Wishlist } from "/lib/collections";
import { check } from "meteor/check";

export function getWishlist(userId) {
  return Wishlist.findOne({ userId });
}

export function createWishlist(userId) {
  check(userId, String);
  const wishlistId = Wishlist.insert({ userId });
  return Wishlist.findOne({ _id: wishlistId });
}

export function addToWishlist(userId, product) {
  let aWishlist = Wishlist.findOne({ userId });
  if (aWishlist == undefined) aWishlist = createWishlist(userId);

  return Wishlist.update(
    {
      _id: aWishlist._id
    },
    {
      $push: {
        items: {
          _id: Random.id(),
          productId: product._id,
          title: product.title
        }
      }
    }
  );
}

export function removeFromWishlist(userId, product, variantId) {
  const aWishlist = Wishlist.findOne({ userId });
  return Wishlist.update(
    {
      _id: aWishlist._id
    },
    {
      $pull: {
        items: {
          productId: product._id
        }
      }
    }
  );
}

Meteor.methods({
  createWishlist(userId) {
    check(userId, String);
    createWishlist(userId);
  },
  addToWishlist(userId, product) {
    check(userId, String);
    check(product, Object);
    addToWishlist(userId, product);
  },
  removeFromWishlist(userId, product) {
    check(userId, String);
    check(product, Object);
    removeFromWishlist(userId, product);
  }
});
