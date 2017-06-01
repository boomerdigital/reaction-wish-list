import {expect} from "meteor/practicalmeteor:chai";
import {Meteor} from "meteor/meteor";
import {Factory} from "meteor/dburles:factory";
import * as Collections from "/lib/collections";
import {Reaction} from "/server/api";
import {Products, Accounts} from "/lib/collections";
import {sinon} from "meteor/practicalmeteor:sinon";
import {addProduct,addProductSingleVariant} from "/server/imports/fixtures/products";
import Fixtures from "/server/imports/fixtures";
import {Wishlist} from "./lib/collections/collection"
import {getShop} from "/server/imports/fixtures/shops";

Fixtures();



describe("WishList", function () {
    const user = Factory.create("registeredUser");
    const shop = getShop();
    const userId = user._id;
    const sessionId = Reaction.sessionId = Random.id();
    let sandbox;


    before(function () {
    });

    beforeEach(function () {
        Wishlist.remove({});
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    after(function () {
        Meteor.users.remove({});
    });


    afterEach(function () {
        Meteor.users.remove({});
    });


    it("Creates a WishList for a user",function(){
      Meteor.call('createWishlist',userId);
      const wishlistId = Wishlist.findOne({userId: userId});
      expect(wishlistId).to.not.be.null
    })

    it("Adds a product/variant to a users wish list ", function(){
      const product = addProduct();
      Meteor.call('addToWishlist', userId, product)
      const aWishlist = Wishlist.findOne({userId: userId});
      expect(aWishlist.items.length).to.equal(1);
    })

    it("Removes a product/variant from wish list items", function(){
        const product = addProduct();
        const product2 = addProductSingleVariant();
        console.log(JSON.stringify(product))
        console.log(JSON.stringify(product2))
        Meteor.call('addToWishlist', userId, product)
        Meteor.call('addToWishlist', userId, addProduct())
        Meteor.call('removeFromWishlist', userId, product)
        const aWishlist = Wishlist.findOne({userId: userId});
        expect(aWishlist.items.length).to.equal(1);
    })

});
