import {expect} from "meteor/practicalmeteor:chai";
import { Meteor } from "meteor/meteor";
import { Factory } from "meteor/dburles:factory";
import { Reaction } from "/server/api";
import { Products, Accounts } from "/lib/collections";
import { sinon } from "meteor/practicalmeteor:sinon";
import { addProduct } from "/server/imports/fixtures/products";
import Fixtures from "/server/imports/fixtures";
import {Wishlist} from "./lib/collections/collection"
import { getShop  } from "/server/imports/fixtures/shops";

Fixtures();

describe("WishList", function () {
    const user = Factory.create("user");
    const shop = getShop();
    const userId = user._id;
    const sessionId = Reaction.sessionId = Random.id();
    let sandbox;
    let originals;
    before(function () {
        originals = {
        };
    });

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    after(() => {
        Meteor.users.remove({});
    });

    afterEach(function () {
        Meteor.users.remove({});
    });

   it("Creates a wish list for a user",function(){
       var wishlistId=Wishlist.insert({userId: userId})
       expect(wishlistId).to.not.be.null
   })

   it("Adds a variant to a users wish list", function(){
       addProduct();
       product = addProduct();
       productId = product._id;
       variantId = Products.findOne({
           ancestors: [productId]
       })._id;
   });


 });




