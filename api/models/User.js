/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    name: {
      type: "string"
    },

    username: {
      type: "string",
      // unique: true,
      // required: true
    },

    password: {
      type: "string"
    },

    confirmedPassword: {
      type: "string"
    },

    address: {
      type: "string"
    },

    email: {
      type: "string"
    },

    role: {
      type: 'string',
      isIn: ['admin', 'tester', 'visitor'],
      defaultsTo: 'visitor'
    },

    cardType: {
      type: 'string'
    },

    cardNum: {
      type: 'string'
    },

    value: {
      type: 'number',
    },

    agreement: {
      type: 'string'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    products: {
      collection: 'PriceTracker',
      via: 'purchase'
    },

    preferences: {
      collection: 'preference',
      via: 'define'
    },

    records: {
      collection: 'record',
      via: 'create'
    },

    purchases: {
      collection: 'purchase',
      via: 'finish'
    },

    payments: {
      collection: 'payment',
      via: 'make'
    },

    value_record: {
      collection: 'Value',
      via: 'user_record'
    }
  },

  customToJSON: function () {
    // Return a shallow copy of this record with the password removed.
    return _.omit(this, ['password'])
  },

};

