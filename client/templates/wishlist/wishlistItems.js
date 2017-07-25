import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Reaction } from "/client/api";
import { Media } from "/lib/collections";
import { Template } from "meteor/templating";


Template.wishlistItems.helpers({
  items() {
    const wishlist = Template.currentData().wishlist;

    if (wishlist && wishlist.items) {
      return wishlist.items;
    }

    return false;
  },
  media: function () {
    // No matter what, Media is defined, but nothing ever returns even though there are media images, productId and variantId are present and match up in the DB. it doesn't seem to connect. Had this issue before with wishlist, tried to do the same thing but didn't work.
    const variantImage = Media.findOne({
      "metadata.productId": this.productId,
      "metadata.variantId": this.variantId
    });
    // variant image
    if (variantImage) {
      return variantImage;
    }
    // find a default image
    const productImage = Media.findOne({
      "metadata.productId": this.productId
    });
    if (productImage) {
      return productImage;
    }
    return false;
  }
});
