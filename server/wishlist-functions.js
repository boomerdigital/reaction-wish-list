import {Meteor} from "meteor/meteor";
import * as Collections from "/lib/collections";
import {Reaction} from "/server/api";
import {Products, Accounts} from "/lib/collections";
import {Wishlist} from "./lib/collections/collection"
import { check } from 'meteor/check'
//import * as Schemas from "/lib/collections/schemas


export function createWishlist(userId){
  check(userId, String)
   const wishlistId=Wishlist.insert({userId:userId});
   return Wishlist.findOne({_id: wishlistId})
}


export function addToWishlist(userId, product){

  var aWishlist = Wishlist.findOne({userId: userId});
  if(aWishlist == undefined)
      aWishlist=createWishlist(userId);

  return Wishlist.update({
    _id: aWishlist._id
  },  {
    $push: {
      items: {
        "_id": Random.id(),
        "productId": product._id,
        "title": product.title,
      }
    }
  });
}


export function removeFromWishlist(userId, product, variantId){
    var aWishlist = Wishlist.findOne({userId: userId});
    return Wishlist.update({
        _id: aWishlist._id
    },  {
        $pull: {
            items: {
                productId: product._id
            }
        }
    });


}

Meteor.methods({
  "createWishlist": function(userId){
    check(userId,String);
    createWishlist(userId);
  },
  "addToWishlist": function(userId,product){
      check(userId,String);
      check(product,Object);
    addToWishlist(userId,product);
  },
  "removeFromWishlist": function(userId,product){
   check(userId,String);
   check(product,Object);
   removeFromWishlist(userId,product);
 }

});
