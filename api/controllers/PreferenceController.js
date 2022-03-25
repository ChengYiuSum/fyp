/**
 * PreferenceController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    preference: async function (req, res) {
        var allPreferences = await Preference.find().populate("define");

        if (!allPreferences) return res.notFound();

        return res.json(allPreferences);
    }

};

