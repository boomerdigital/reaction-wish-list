import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
* OrderItems Schema
* merges with Cart and Order to create Orders collection
*/
export const WishListItem = new SimpleSchema({
    additionalField: {
        type: String,
        optional: true
    }
});



/**
 * Order Schema
 */
export const Wishlist = new SimpleSchema({

    Id: {
        type: String,
        optional: true
    },
    userId: {
        type: String,
        unique: false
    },
    items: {
        type: [WishListItem],
        optional: true
    }

});