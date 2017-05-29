import {Meteor} from "meteor/meteor";
import * as Collections from "/lib/collections";
import {Reaction} from "/server/api";
import {Products, Accounts} from "/lib/collections";
import {Wishlist} from "./lib/collections/collection"
//import * as Schemas from "/lib/collections/schemas


export function createWishList(user){
   WishList.insert({userId:user._id});
}


export function addToWishList(user, product){
  const wishListId = WishList.insert({userId:user._id});
  return WishList.update({
    _id:wishListId
  },  {
    $addToSet: {
      items: {
        _id: Random.id(),
        productId: product.productId,
        title: product.title,
      }
    }
  });
}


export function removeFromWishList(user, productId, variantId){


}

Meteor.methods({
  "createWishList": function(user){
    createWishList(user);
  },
  "addToWishList": function(user,product){
    addToWishList(user,product);
  }

});
