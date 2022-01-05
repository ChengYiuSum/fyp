/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

module.exports.bootstrap = async function () {

  sails.bcrypt = require('bcryptjs');
  var salt = await sails.bcrypt.genSalt(10);

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```
  if (await Person.count() > 0) {
    return generateUsers();
  }

  await Person.createEach([
    { name: "Martin Choy", age: 23 },
    { name: "Kenny Cheng", age: 22 },
    // etc.
  ]);

  return generateUsers();

  async function generateUsers() {

    if (await User.count() > 0) {
      return;
    }

    var hash = await sails.bcrypt.hash('123456', salt);

    await User.createEach([
      { name: "Martin Choy", username: "admin", password: '123456', confirmedPassword: '123456', address: "RRS719", email: "mtchoy@comp.hkbu.edu.hk", cardType: "Visa", cardNum: "1234-2345-3456-4567" },
      { name: "Fion Lee", username: "boss", password: '123456', confirmedPassword: '123456', address: "RRS725", email: "fionlee@comp.hkbu.edu.hk", cardType: "Mastercard", cardNum: "2345-3456-4567-5678" },
      { name: "Kenny Cheng", username: "tutor", password: '123456', confirmedPassword: '123456', address: "RRS637", email: "kennycheng@comp.hkbu.edu.hk", cardType: "Visa", cardNum: "3456-4567-5678-6789" },
      { name: "Byron Choi", username: "observer", password: '123456', confirmedPassword: '123456', address: "DLB628", email: "choi@comp.hkbu.edu.hk", cardType: "Mastercard", cardNum: "4567-5678-6789-7890" },
      // etc.
    ]);
  }
};
