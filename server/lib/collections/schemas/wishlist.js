import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
* OrderItems Schema
* merges with Cart and Order to create Orders collection
*/
export const WishListItem = new SimpleSchema({
    productId: {
        type: String,
        optional: false
    },
    variantId: {
        type: String,
        optional: true
    },
    title: {
        type: String,
        defaultValue: "",
        label: "Product Title"
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
        unique:true
    },
    items: {
        type: [WishListItem],
        optional: true
    }

});