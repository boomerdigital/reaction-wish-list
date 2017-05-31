import {Meteor} from "meteor/meteor";
import * as Collections from "/lib/collections";
import {Reaction} from "/server/api";
import {Products, Accounts} from "/lib/collections";
import {Wishlist} from "./lib/collections/collection"
import { check } from 'meteor/check'
//import * as Schemas from "/lib/collections/schemas


export function createWishlist(userId){
  check(userId, String)
   Wishlist.insert({userId:userId});
}


export function addToWishlist(userId, product){

  const wishListId = Wishlist.insert({userId:userId});
  return Wishlist.update({
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


export function removeFromWishlist(user, productId, variantId){


}

Meteor.methods({
  "createWishList": function(userId){
    check(userId,String);
    createWishlist(userId);
  },
  "addToWishList": function(userId,product){
      check(userId,String);
      check(product,Object);
    addToWishlist(userId,product);
  }

});
