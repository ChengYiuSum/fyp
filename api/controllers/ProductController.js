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

    scrape: async function (req, res) {
        var today = new Date()
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        if (req.method == "GET") {
            const puppeteer = require('puppeteer');

            async function scrapeProduct(url, num) {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                await page.goto(url);
                await page.waitForNetworkIdle();

                if (num == 1) {
                    for (let a of await page.$$('.ProductItem > a[href^="/tc/product/"]')) {
                        try {
                            console.log("entered")
                            let productUrl = await a.evaluate(node => node.href)
                            let productID = productUrl.replace('https://www.ztore.com/tc/product/', '').split('-').slice(-2)[0]
                            let imgUrl = 'https://image.ztore.com/images/ztore/production/product/260px/' + productID + '_1.jpg'
                            let img = await a.$('.img img[alt]');
                            let title = await img.evaluate(node => node.getAttribute('alt'))
                            let price = await a.$eval('.price > .promotion', node => node.textContent);

                            console.log("finding")
                            var thatProduct = await PriceTracker.findOne({ title: title });

                            // console.log(thatProduct.price)

                            // console.log(typeof(thatProduct.price))

                            // var newPriceArray = []

                            // newPriceArray.push(price)

                            var product = await Product.create({ "price": price, "date": "2022-4-6", "have": thatProduct.id }).fetch();


                            // var newProduct = await Product.updateOne(thatProduct.id).set({ price: newPriceArray })

                            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                            console.log(product)

                            if (!thatProduct) {
                                var product = await PriceTracker.create({ "title": title, "price": price, "imgUrl": imgUrl, "shop": "ztore", "type": "carbonated-drinks", "date": "2022-3-31" }).fetch();
                            } else if (thatProduct) {
                                //Update
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                } else if (num == 2) {
                    for (let a of await page.$$('.grid-item__content > a[href^="/collections/carbonated-drink/products/"]')) {
                        try {
                            let title = await a.$eval('.grid-product__title', node => node.textContent)
                            let price = await a.$eval('.grid-product__price [aria-hidden="true"]', node => node.textContent);
                            let noScript = await a.$eval('.grid-product__image-wrap noscript', node => node.textContent);
                            let test = noScript.split(' ').filter(s => s.indexOf('src="') !== -1)[0]
                            let temp = test.trim().replace('src="', '').replace('"', '')
                            let imgUrl = 'https:' + temp

                            var thatProduct = await PriceTracker.findOne({ title: title });

                            var product = await Product.create({ "price": price, "date": "2022-4-6", "have": thatProduct.id }).fetch();


                            if (!thatProduct) {
                                var product = await PriceTracker.create({ "title": title, "price": price, "imgUrl": imgUrl, "shop": "citySuper", "type": "carbonated-drinks", "date": "2022-3-31" }).fetch();
                            } else if (thatProduct) {
                                //Update
                            }
                        } catch (e) { console.log(e) }
                    }

                    var allProduct = await Product.find()

                    var date = []
                    var price = []

                    for (var i = 0; i < allProduct.length; i++) {
                        date.push(allProduct[i].date);
                        price.push(parseInt(allProduct[i].price));
                    }

                    console.log(typeof (date))
                    console.log(typeof (price))

                }
            }
            scrapeProduct('https://www.ztore.com/tc/category/all/beverage/carbonated-beverage', 1)
            scrapeProduct('https://online.citysuper.com.hk/collections/carbonated-drink', 2)

        }
        return res.view('priceTracker/scrape', {});

    },

    chart: async function (req, res) {

        var product = await PriceTracker.findOne(req.params.id).populate("charts");

        var date = []
        var price = []

        for (var i = 0; i < product.charts.length; i++) {
            date.push(product.charts[i].date);
            priceStr = product.charts[i].price.substring(1)
            price.push(parseInt(priceStr));
        }

        return res.view('priceTracker/chart', { date: date, price: price });

    },

    populate_chart: async function (req, res) {

        var product = await PriceTracker.findOne(req.params.id).populate("charts");

        if (!product) return res.notFound();

        return res.json(product);
    },

};

