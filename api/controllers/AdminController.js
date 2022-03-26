/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    valuePreview: async function (req, res) {
        if (req.wantsJSON) {

            var offset = Math.max(req.query.offset, 0) || 0;

            var limitColum = 10;

            var value_form = await Value.find({
                where: { status: "" },
                sort: 'id DESC',
                limit: limitColum,
                skip: offset,
            }).populate("user_record");

            return res.json(value_form);	    // for ajax request

        } else {

            // var search = req.query.search || req.query.myInput || "";
            // var offset = Math.max(req.query.offset, 0) || 0;
            // var limitColum = 10;

            var count = await Value.count()

            // if no record, return nothing 
            if (count == 0) {
                var value_form = await Value.find()
                return res.view('admin/value', { forms: value_form, numOfRecords: count });
            }


            // find all records
            var all = await Value.find({
                sort: 'id DESC',
            }).populate("user_record");

            return res.view('admin/value', { forms: all, numOfRecords: count });


            // only output 10 records for each request
            // var i;
            // var cnt = 0;
            // var CollectedForm = [10];
            // for (i = offset; i < offset + 10; i++) {
            //     if (i < filterForms.length) {
            //         CollectedForm[cnt] = filterForms[i];
            //     } else {
            //         break;
            //     }
            //     cnt++;
            // }

            // return res.view('admin/value', { forms: CollectedForm, numOfRecords: count, offset: offset });

        }
    },

    approve: async function (req, res) {

        var thatValueAdded = await Value.findOne(req.params.id).populate("user_record");

        if (!thatValueAdded) return res.notFound();

        var thatUser = await User.findOne(thatValueAdded.user_record[0].id)

        if (!thatUser) return res.notFound();

        // console.log("testing");
        // console.log(thatCoachPaymentForm.id);

        // console.log("testing2");
        // console.log(thatCoachPaymentForm);

        await User.updateOne(thatValueAdded.user_record[0].id).set({
            value: thatUser.value + parseInt(thatValueAdded.value)
        });

        await Value.removeFromCollection(req.params.id, "user_record").members(thatValueAdded.user_record[0].id);
        await Value.destroyOne(req.params.id);

        return res.ok();
    },

    populate_value_record: async function (req, res) {

        var value = await Value.find().populate("user_record");

        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        console.log(value)

        if (!value) return res.notFound();

        return res.json(value);
    },


    setting: async function (req, res) {
        if (req.method == "GET") return res.view('user/setting')

        var time = req.body.time

        var allPreferences = await Preference.find().populate("define");

        return res.view('user/test', { time: time, preferences: allPreferences });

    },

    preference: async function (res, req) {
        if (req.method == "GET") {

            var allPreferences = await Preference.find().populate("define");

            return res.json(allPreferences);
        }
    },

    matching: async function (req, res) {
        if (req.method == "GET") {
            console.log("AutoMatching~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

            var allPreferences = await Preference.find().populate("define");

            for (var i = 0; i < allPreferences.length; i++) {
                console.log("AutoMatching~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                var preferencedProduct = await PriceTracker.findOne(allPreferences[i].own)
                if (parseInt(preferencedProduct.price.substring(1)) <= allPreferences[i].prePrice) {
                    console.log("matched sucess")
                    var message = "The price is below your prefered price now. You can click the \"add to cart \" button to purchase it!"

                    sails.hooks['email-without-ejs'].send({
                        to: "sammy3963@gmail.com",
                        subject: "Testing",
                        html: await sails.renderView('priceTracker/testEmail', {
                            recipientNo: req.body.applyno,
                            changesform: req.body,
                            layout: false
                        })
                    }, function (err) { console.log(err || "It worked!") })
                } else {
                    console.log("matched unsuccess")

                    const today = new Date();

                    let y = today.getFullYear();
                    let m = today.getMonth() + 1;
                    let d = today.getDate();

                    var date = y + "-" + m + "-" + d

                    if (allPreferences[i].expiryDate < date) {
                        console.log("Expired")

                        await Preference.destroyOne(allPreferences[i].id);
                    }
                }
            }

            console.log("Success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log(allPreferences)

            return res.json(allPreferences);
        }

    },


    loadTest: async function (req, res) {
        if (req.method == "GET") return res.json("loaderio-de4c69f9f00e62494ea5278001babfec")
    },

};

