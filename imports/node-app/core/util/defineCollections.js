/**
 * @name defineCollections
 * @method
 * @memberof GraphQL
 * @summary Adds Collection instances to the provided `collections` map
 * @param {MongoDatabase} db A database instance from Node Mongo client
 * @param {Object} collections An object to mutate with all of the Reaction collections
 * @returns {undefined} No return
 */
export default function defineCollections(db, collections) {
  Object.assign(collections, {
    Accounts: db.collection("Accounts"),
    AccountSearch: db.collection("AccountSearch"),
    Assets: db.collection("Assets"),
    Cart: db.collection("Cart"),
    Catalog: db.collection("Catalog"),
    Discounts: db.collection("Discounts"),
    Emails: db.collection("Emails"),
    Groups: db.collection("Groups"),
    Inventory: db.collection("Inventory"),
    MediaRecords: db.collection("cfs.Media.filerecord"),
    NavigationItems: db.collection("NavigationItems"),
    NavigationTrees: db.collection("NavigationTrees"),
    Notifications: db.collection("Notifications"),
    Orders: db.collection("Orders"),
    OrderSearch: db.collection("OrderSearch"),
    Packages: db.collection("Packages"),
    Products: db.collection("Products"),
    ProductSearch: db.collection("ProductSearch"),
    roles: db.collection("roles"),
    SellerShops: db.collection("SellerShops"),
    Shipping: db.collection("Shipping"),
    Shops: db.collection("Shops"),
    Tags: db.collection("Tags"),
    Taxes: db.collection("Taxes"),
    TaxCodes: db.collection("TaxCodes"),
    Templates: db.collection("Templates"),
    Themes: db.collection("Themes"),
    Translations: db.collection("Translations"),
    users: db.collection("users"),
    Wishlist: db.collection("Wishlist")
  });
}
