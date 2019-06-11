# meteor-connector-shopify

A plugin for Reaction Commerce that allows you exchange data with a Shopify shop

## This plugin is a community plugin and is not supported by the Reaction team.
Please use *at your own risk*. The Reaction team will not respond to issues or PR's on this
but welcome the community to contribute.

## How to install

1. `git clone git@github.com:reaction-contrib/meteor-connectors-shopify.git`
2. Copy the `connectors` and `connectors-shopify` to `<reaction-root>/imports/plugins/custom`
3. `meteor npm install --save shopify-api-node  @reactioncommerce/hooks` (it can't be added to the local `package.json`
4. `reaction reset -y`

## Configuration

Configuration can be performed by Administrators in the Reaction Dashboard.

It can also be done in `private/settings/reaction.json` by adding (or updating) the following configuration details (remember to fill in the blanks):

```json
{
    "name": "reaction-connectors-shopify",
    "enabled": true,
    "settings": {
      "apiKey": "<your API key>",
      "password": ",your API password>",
      "sharedSecret": "Your shared secret",
      "shopName": "Your shop name"
    }
  }]
```
