/**
 * PriceTrackerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    main: async function (req, res) {
        if (req.method == "GET") return res.view('user/main');
    },

    homepage: async function (req, res) {

        if (req.method == "GET") {
            const puppeteer = require('puppeteer');


            // console.log("entered home function")

            async function scrapeProduct(url, num) {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                await page.goto(url);
                await page.waitForNetworkIdle();

                //const arr = []
                //let arr = await page.$$eval('a[href^="/tc/product/"]', (nodes) => nodes.map(e => e.href));
                // const [el] = await page.$x('//*[@id="ProductPhotos-1515339415595"]/div/div/div[1]/div/div/img')
                // const src = await el.getProperty('src');
                // const imgURL = await src.jsonValue(); 
                // newArr = []

                // for (let i = 0; i < arr.length; i++) {
                //     newArr[i] = arr[i].replace('https://www.ztore.com/tc/product/', '')
                // }

                // productID = []
                // for (let i = 0; i < newArr.length; i++) {
                //     productID[i] = newArr[i].split('-').slice(-2)[0]
                // }


                //const titles = await page.$$eval('.name_bbd', (nodes) => nodes.map(node => node.textContent));
                // const txt = await el2.getProperty('textContent');
                // const title = await txt.jsonValue();

                //const prices = await page.$$eval('.price > .promotion', (nodes) => nodes.map(node => node.textContent));
                // const txt2 = await el3.getProperty('textContent');
                // const price = await txt2.jsonValue();

                // const [el4] = await page.$x('//*[@id="MainContent"]/div[1]/nav/ul/li[3]/a')
                // const txt3 = await el4.getProperty('textContent');
                // const category = await txt3.jsonValue();

                // console.log(imgURLs);
                // console.log(arr);
                // console.log(newArr);
                // console.log(productID);
                // console.log(titles);
                // console.log(prices);
                //console.log({ imgURL, title, price, category });

                if (num == 1) {
                    for (let a of await page.$$('.ProductItem > a[href^="/tc/product/"]')) {
                        try {
                            // console.log("entered retrieve ztore data")
                            let productUrl = await a.evaluate(node => node.href)
                            let productID = productUrl.replace('https://www.ztore.com/tc/product/', '').split('-').slice(-2)[0]
                            let imgUrl = 'https://image.ztore.com/images/ztore/production/product/260px/' + productID + '_1.jpg'
                            let img = await a.$('.img img[alt]');
                            //let imgUrl = await img.evaluate(node => node.src)
                            let title = await img.evaluate(node => node.getAttribute('alt'))
                            // add a if statement here (if no promotion)
                            let price = await a.$eval('.price > .promotion', node => node.textContent);
                            // console.log(productUrl, imgUrl, title, price)

                            var thatProduct = await PriceTracker.findOne({ title: title });

                            //     var product = await PriceTracker.create({ "title": title, "price": price, "category": category, "shop": "citySuper" }).fetch();

                            var today = new Date()
                            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                            // console.log(date)

                            if (!thatProduct) {
                                var product = await PriceTracker.create({ "title": title, "price": price, "imgUrl": imgUrl, "shop": "ztore", "type": "carbonated-drinks", "date": date }).fetch();
                                // console.log("product created")
                                // console.log(product)
                                //return res.status(300).json("Successfully retrieved");
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
                            // console.log("entered retrieve citysuper data")
                            let title = await a.$eval('.grid-product__title', node => node.textContent)
                            let price = await a.$eval('.grid-product__price [aria-hidden="true"]', node => node.textContent);
                            let noScript = await a.$eval('.grid-product__image-wrap noscript', node => node.textContent);
                            let test = noScript.split(' ').filter(s => s.indexOf('src="') !== -1)[0]
                            let temp = test.trim().replace('src="', '').replace('"', '')
                            let imgUrl = 'https:' + temp

                            var thatProduct = await PriceTracker.findOne({ title: title });

                            if (!thatProduct) {
                                var product = await PriceTracker.create({ "title": title, "price": price, "imgUrl": imgUrl, "shop": "citySuper", "type": "carbonated-drinks" }).fetch();
                                // console.log("product created")
                                // console.log(product)
                                //return res.status(300).json("Successfully retrieved");
                            } else if (thatProduct) {
                                //Update
                            }
                        } catch (e) { console.log(e) }
                    }

                }
            }



            // async function scrapeProduct(url, url2, url3, url4) {
            //     const browser = await puppeteer.launch();
            //     const page = await browser.newPage();

            //     //if (x == 1) {
            //     await page.goto(url);
            //     const [el] = await page.$x('//*[@id="ProductPhotos-1515339415595"]/div/div/div[1]/div/div/img')
            //     const src = await el.getProperty('src');
            //     const imgURL = await src.jsonValue();

            //     const [el2] = await page.$x('//*[@id="ProductSection-1515339415595"]/div/div/div[1]/div/h1');
            //     const txt = await el2.getProperty('textContent');
            //     const title = await txt.jsonValue();

            //     const [el3] = await page.$x('//*[@id="ProductPrice-"]/span[1]')
            //     const txt2 = await el3.getProperty('textContent');
            //     const price = await txt2.jsonValue();

            //     const [el4] = await page.$x('//*[@id="MainContent"]/div[1]/nav/ul/li[3]/a')
            //     const txt3 = await el4.getProperty('textContent');
            //     const category = await txt3.jsonValue();

            //     console.log({ imgURL, title, price, category });
            //     var product = await PriceTracker.create({ "title": title, "price": price, "category": category, "shop": "citySuper" }).fetch();

            //     //} else if (x == 2) {
            //     //const [el] = await page.$x('//*[@id="detail"]/div[1]/div[1]/div[1]/div[1]/div');
            //     await page.goto(url2);
            //     const [ela] = await page.$x('//*[@id="detail"]/div[1]/div[1]/div[1]/div[1]/div')
            //     const srca = await ela.getProperty('src');
            //     const imgURLa = await srca.jsonValue();

            //     //const [el2] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[2]/div[1]/h2');
            //     const [el2a] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[2]/div[1]/h2');
            //     const txta = await el2a.getProperty('textContent');
            //     const titlea = await txta.jsonValue();


            //     //const [el3] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[4]/div/span[1]')
            //     const [el3a] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[4]/div/span[1]')
            //     const txt2a = await el3a.getProperty('textContent');
            //     const pricea = await txt2a.jsonValue();

            //     //const [el4] = await page.$x('//*[@id="MainContent"]/div[1]/nav/ul/li[3]/a')
            //     const [el4a] = await page.$x('//*[@id="BaseLayout"]/div/div[4]/span[1]/div[3]/div/div/div/div/input')
            //     const txt3a = await el4a.getProperty('textContent');
            //     const categorya = await txt3a.jsonValue();

            //     console.log({ imgURLa, titlea, pricea, categorya });
            //     var product = await PriceTracker.create({ "title": titlea, "price": pricea, "category": categorya, "shop": "ztore" }).fetch();


            //     await page.goto(url3);
            //     const [elb] = await page.$x('//*[@id="ProductPhotos-1860299817003"]/div/div/div[1]/div/div/img')
            //     const srcb = await elb.getProperty('src');
            //     const imgURLb = await srcb.jsonValue();

            //     const [el2b] = await page.$x('//*[@id="ProductSection-1860299817003"]/div/div/div[1]/div/h1');
            //     const txtb = await el2b.getProperty('textContent');
            //     const titleb = await txtb.jsonValue();

            //     const [el3b] = await page.$x('//*[@id="ProductPrice-"]/span[1]')
            //     const txt2b = await el3b.getProperty('textContent');
            //     const priceb = await txt2b.jsonValue();

            //     const [el4b] = await page.$x('//*[@id="MainContent"]/div[1]/nav/ul/li[3]/a')
            //     const txt3b = await el4b.getProperty('textContent');
            //     const categoryb = await txt3b.jsonValue();

            //     console.log({ imgURLb, titleb, priceb, categoryb });
            //     var product = await PriceTracker.create({ "title": titleb, "price": priceb, "category": categoryb, "shop": "citySuper" }).fetch();

            //     //} else if (x == 2) {
            //     //const [el] = await page.$x('//*[@id="detail"]/div[1]/div[1]/div[1]/div[1]/div');
            //     await page.goto(url4);
            //     const [elc] = await page.$x('//*[@id="detail"]/div[1]/div[1]/div[1]/div[1]/div')
            //     const srcc = await elc.getProperty('src');
            //     const imgURLc = await srcc.jsonValue();

            //     //const [el2] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[2]/div[1]/h2');
            //     const [el2c] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[2]/div[1]/h2');
            //     const txtc = await el2c.getProperty('textContent');
            //     const titlec = await txtc.jsonValue();


            //     //const [el3] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[4]/div/span[1]')
            //     const [el3c] = await page.$$('.price')
            //     const txt2c = await el3c.getProperty('textContent');
            //     const pricec = await txt2c.jsonValue();

            //     //const [el4] = await page.$x('//*[@id="MainContent"]/div[1]/nav/ul/li[3]/a')
            //     const [el4c] = await page.$x('//*[@id="BaseLayout"]/div/div[4]/span[1]/div[3]/div/div/div/div/input')
            //     const txt3c = await el4c.getProperty('textContent');
            //     const categoryc = await txt3c.jsonValue();

            //     console.log({ imgURLc, titlec, pricec, categoryc });
            //     var product = await PriceTracker.create({ "title": titlec, "price": pricec, "category": categoryc, "shop": "ztore" }).fetch();

            //     //}

            //     //console.log(titles)
            //     //var titles = [title, "chocolate", "milk"]
            //     //console.log(titles)

            //     browser.close();

            //     //var product = await PriceTracker.create({ "title": "Test", "price": "$123", "category": "fruit", "shop": "ztore" }).fetch();
            //     //var product = await PriceTracker.create({ "title": "Test", "price": "$123", "category": "fruit", "shop": "ztore" }).fetch();


            //     //console.log(product)

            //     return res.view('priceTracker/homepage');
            // }

            scrapeProduct('https://www.ztore.com/tc/category/all/beverage/carbonated-beverage', 1)
            scrapeProduct('https://online.citysuper.com.hk/collections/carbonated-drink', 2)
            //scrapeProduct('https://www.ztore.com/tc/product/soya-bean-milk-1000001');
            //scrapeProduct('https://online.citysuper.com.hk/collections/beverage-energy-functional-drink/products/pocari-sweat-ion-supply-drink-170300084', 'https://www.ztore.com/tc/product/ion-supply-drink-6002965#query=%E5%AF%B6%E7%A4%A6%E5%8A%9B')
            //scrapeProduct('https://online.citysuper.com.hk/products/soy-milk', 'https://www.ztore.com/tc/product/mainichi-oishii-muchosei-tonyu-1012268#query=%E8%B1%86%E5%A5%B6', 'https://online.citysuper.com.hk/collections/beverage-energy-functional-drink/products/pocari-sweat-ion-supply-drink-170300084', 'https://www.ztore.com/tc/product/ion-supply-drink-6002965#query=%E5%AF%B6%E7%A4%A6%E5%8A%9B')
            //scrapeProduct('https://www.ztore.com/tc/product/mainichi-oishii-muchosei-tonyu-1012268#query=%E8%B1%86%E5%A5%B6', 2)

        }
        return res.view('priceTracker/homepage');
    },

    category: async function (req, res) {
        // if (req.method == "GET") {
        //     console.log("entered")
        //     const puppeteer = require('puppeteer');

        //     async function scrapeProduct(url) {
        //         const browser = await puppeteer.launch();
        //         const page = await browser.newPage();
        //         await page.goto(url);

        //         const [el] = await page.$x('//*[@id="detail"]/div[1]/div[1]/div[1]/div[1]/div');
        //         const src = await el.getProperty('src');
        //         const imgURL = await src.jsonValue();

        //         const [el2] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[2]/div[1]/h2');
        //         const txt = await el2.getProperty('textContent');
        //         const title = await txt.jsonValue();

        //         const [el3] = await page.$x('//*[@id="detail"]/div[1]/div[2]/div[4]/div/span[1]')
        //         const txt2 = await el3.getProperty('textContent');
        //         const price = await txt2.jsonValue();

        //         const [el4] = await page.$x('//*[@id="BaseLayout"]/div/div[4]/span[1]/div[1]/div/div/div/div/input')
        //         const txt3 = await el4.getProperty('textContent');
        //         const category = await txt3.jsonValue();

        //         console.log(title)
        //         console.log(price)

        //         titles = [title, "chocolate", "milk"]
        //         console.log(titles)
        //         //console.log({ imgURL, title, price, category });

        //         browser.close();

        //         var product = await PriceTracker.create(titles).fetch();

        //         console.log(product)

        //         return res.view('priceTracker/category', { titles: title, link: imgURL, price: price, product: product })
        //     }
        //     scrapeProduct('https://www.ztore.com/tc/product/soya-bean-milk-1000001');
        // }




        var thatCategory = await PriceTracker.find();

        if (!thatCategory) return res.notFound();

        return res.view('priceTracker/category', { thatCategory: thatCategory })
    },

    type: async function (req, res) {
        var everyproducts = await PriceTracker.find();

        return res.view('priceTracker/type', { everyproducts: everyproducts })
    },

    json: async function (req, res) {
        var everyproducts = await PriceTracker.find();

        return res.json(everyproducts);
    },

    product: async function (req, res) {
        var thatProduct = await PriceTracker.findOne(req.params.id);

        var thatProductChart = await PriceTracker.findOne(req.params.id).populate("charts");

        var date = []
        var price = []

        for (var i = 0; i < thatProductChart.charts.length; i++) {
            date.push(thatProductChart.charts[i].date);
            priceStr = thatProductChart.charts[i].price.substring(1)
            price.push(parseInt(priceStr));
        }

        if (!thatProduct) return res.notFound();

        if (req.method == "GET") {

            return res.view('priceTracker/product', { product: thatProduct, date: date, price: price })

        } else {

            // var today = new Date()
            // const today = new Date();

            // let y = today.getFullYear();
            // let m = today.getMonth() + 1;
            // let d = today.getDate();

            // console.log(today)
            // console.log(y)
            // console.log(m)
            // console.log(d)


            // var date = new Date(y, m, d);
            // var date = y + "-" + m + "-" + d
            // // console.log(req.body)
            // console.log(req.body.expiryDate)
            // console.log(date)

            // if (req.body.expiryDate < date) return res.status(401).json("Invalid Expiry Date")

            var preference = await Preference.create(req.body).fetch();

            preferencedProduct = await PriceTracker.findOne(preference.own);

            // console.log(preference)
            // console.log("~~~~~~~~~~~~~~~~~~~~~~")
            // console.log("preference: " + preference.prePrice)
            // console.log("----------------------")
            // console.log("preferencedProduct: " + parseInt(preferencedProduct.price.substring(1)))

            if (parseInt(preferencedProduct.price.substring(1)) <= preference.prePrice) {
                console.log("matched sucess")
                var message = "The price is below your prefered price now. You can click the \"add to cart \" button to purchase it!"

                sails.hooks['email-without-ejs'].send({
                    to: "18225756@life.hkbu.edu.hk",
                    subject: "The price is below your prefered price now. You can purchase it!",
                    html: await sails.renderView('priceTracker/testEmail', {
                        recipientName: req.session.name,
                        preference: preference,
                        preferencedProduct: preferencedProduct,
                        senderName: "PriceTracker",
                        layout: false
                    })
                }, function (err) { console.log(err || "It worked!") })

                // return res.ok();

            } else {
                console.log("match unsucess")
                var message = "When the price fit your prefered price. You will get notice!"

                sails.hooks['email-without-ejs'].send({
                    to: "18225756@life.hkbu.edu.hk",
                    subject: "PriceTracker: Product's prefered price is arrived!",
                    html: await sails.renderView('priceTracker/testEmail', {
                        recipientName: req.session.name,
                        preference: preference,
                        preferencedProduct: preferencedProduct,
                        senderName: "PriceTracker",
                        layout: false
                    })
                }, function (err) { console.log(err || "It worked!") })
                // return res.ok();

            }

            console.log(message)
            return res.view('priceTracker/product', { product: thatProduct, message: message, date: date, price: price })
        }
    },

    // see who have the relationship with the product
    populate: async function (req, res) {

        var product = await PriceTracker.findOne(req.params.id).populate("purchase");

        if (!product) return res.notFound();

        return res.view('priceTracker/customer', { product: product });

    },

    populate_preference: async function (req, res) {

        var product = await PriceTracker.findOne(req.params.id).populate("preferences");

        if (!product) return res.notFound();

        return res.json(product);
    },

    //delete the product from database
    delete: async function (req, res) {

        var deletedProduct = await PriceTracker.destroyOne(req.params.id);

        if (!deletedProduct) return res.notFound();

        if (req.wantsJSON) {
            return res.status(204).send();	    // for ajax request
        } else {
            return res.redirect('/');			// for normal request
        }
    },

    search: async function (req, res) {

        var whereClause = {};

        if (req.query.title) whereClause.title = { contains: req.query.title };

        var thoseProducts = await PriceTracker.find({
            where: whereClause,
            sort: 'id'
        });

        var count = 0;

        // console.log(thoseProducts)

        return res.view('priceTracker/search', { products: thoseProducts, count: count });
    },

    matching: async function (req, res) {
        if (req.method == "GET") {
            var allPreferences = await Preference.find().populate("define");

            console.log("Success!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log(allPreferences)

            return res.json(allPreferences);
        }

    },

    // find: async function (req, res) {

    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!entered")

    // var thatProduct = await User.findOne(req.session.userid).populate('preferences')

    // var cnt = thatProduct.preferences.length

    // console.log(thatProduct)

    // console.log(cnt)
    // console.log(thatProduct.preferences[cnt].id)

    // var thatProduct = await PriceTracker.findOne(req.params.id);



    // console.log(thatProduct)

    // var string1 = JSON.stringify(thatProduct)
    // console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")


    // console.log(string1)
    // var obj = JSON.parse(string1)
    // console.log(obj)

    // console.log(obj.title)

    //     return res.ok()

    // }
}