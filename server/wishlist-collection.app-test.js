import {expect} from "meteor/practicalmeteor:chai";
import {Meteor} from "meteor/meteor";
import {Factory} from "meteor/dburles:factory";
import * as Collections from "/lib/collections";
import {Reaction} from "/server/api";
import {Products, Accounts} from "/lib/collections";
import {sinon} from "meteor/practicalmeteor:sinon";
import {addProduct} from "/server/imports/fixtures/products";
import Fixtures from "/server/imports/fixtures";
import {Wishlist} from "./lib/collections/collection"
import {getShop} from "/server/imports/fixtures/shops";

Fixtures();


function logObject(obj, result ) {
    if (typeof object != "object")
        return "Invalid object";
    if (typeof result == "undefined")
        result = '';

    if (result.length > 50)
        return "[RECURSION TOO DEEP. ABORTING.]";

    var rows = [];
    for (var property in object) {
        var datatype = typeof object[property];

        var tempDescription = result + '"' + property + '"';
        tempDescription += ' (' + datatype + ') => ';
        if (datatype == "object")
            tempDescription += 'object: ' + objectInspector(object[property], result + '  ');
        else
            tempDescription += object[property];

        rows.push(tempDescription);
    }
}


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

    it("Creates a wish list for a user", function () {
        const wishlistId=Wishlist.insert({userId: userId})
        expect(wishlistId).to.not.be.null
    })

    it("Adds a product/variant to a users wish list", function () {
        const product = addProduct();
        productId = product._id;
        variantId = Products.findOne({
            ancestors: [productId]
        })._id;

        const wishlistId = Wishlist.insert({userId: userId})
        console.log("WIshlist ID"+ wishlistId);
        expect(wishlistId).to.not.be.null


            Wishlist.update({
                _id: wishlistId
            }, {
                $addToSet: {
                    items: {
                        _id: Random.id(),
                        productId: product.productId,
                        title: product.title,
                    }
                }
            });

        const aWishlist = Wishlist.findOne({_id: wishlistId});
        console.log("Wishlist item size"+console.log(aWishlist.items));
        //expect(aWishlist.items.length).to.equal(2);

    });
});




