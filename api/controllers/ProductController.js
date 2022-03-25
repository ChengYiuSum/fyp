/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    json: async function (req, res) {

        var product = await Product.find();

        if (!product) return res.notFound();

        return res.json(product);
    },

    chart: async function (req, res) {

        var allProduct = await Product.find()

        var date = []
        var price = []

        for (var i = 0; i < allProduct.length; i++) {
            date.push(allProduct[i].date);
            price.push(parseInt(allProduct[i].price));
        }

        console.log(typeof(date))
        console.log(typeof(price))

        return res.view('priceTracker/chart', { date: date, price: price });

    }

};

