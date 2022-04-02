/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  PriceTrackerController: {
    // forbid different roles to use some functions in the controller 
    // homepage: 'isAdmin'
  },

  AdminController: {
    valuePreview: 'isAdmin',
    approve: 'isAdmin',
    setting: 'isAdmin',
    preference: 'isAdmin'
  }

};
