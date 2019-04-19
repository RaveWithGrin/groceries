var express = require('express');
var morgan = require('morgan');
var path = require('path');
var request = require('request-promise');
var cheerio = require('cheerio');

var getGroceries = async function(store) {
    var options = {
        url: store.flyerURL + store.flyerId,
        headers: {
            Accept: '*/*'
        }
    };
    var response = await request.get(options);
    jsonResponse = JSON.parse(response);
    var groceries = {};
    for (var i = 0; i < jsonResponse.items.length; i++) {
        var item = jsonResponse.items[i];
        if (item.category_names.length > 0) {
            if (!(item.category_names[0] in groceries)) {
                groceries[item.category_names[0]] = [];
            }
            groceries[item.category_names[0]].push({
                name: item.name,
                description: item.description,
                price: item.current_price,
                priceText: item.price_text,
                validFrom: new Date(item.valid_from),
                validTo: item.valid_to,
                image: item.large_image_url.replace('https', 'http'),
                store: store.name
            });
        }
    }
    for (var category in groceries) {
        groceries[category].sort(function(a, b) {
            if (a.name > b.name) {
                return 1;
            } else if (a.name < b.name) {
                return -1;
            } else {
                return 0;
            }
        });
    }
    return groceries;
};

var getFlyerId = async function(url) {
    var flyerId = undefined;
    var options = {
        url: url,
        headers: {
            Accept: '*/*'
        }
    };
    var response = await request.get(options);
    var html = cheerio.load(response);
    var regexp = /current_flyer_id":(.+?),/g;
    html('script')
        .get()
        .forEach(function(script) {
            script.children.forEach(function(child) {
                if (child.data.indexOf('current_flyer_id') !== -1) {
                    flyerId = regexp.exec(child.data)[1];
                }
            });
        });
    return flyerId;
};

var app = express();
var port = process.env.PORT || 8081;

app.use(morgan('tiny'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.sendFile('main.html', { root: __dirname });
});

app.get('/getGroceries', async function(req, res) {
    var stores = [
        {
            name: 'No Frills',
            flyerIdURL: 'http://flyers.nofrills.ca/flyers/nofrills?type=2&store_code=3123',
            flyerURL: 'http://flyers.nofrills.ca/flyer_data/'
        },
        {
            name: 'Food Basics',
            flyerIdURL: 'http://ecirculaire.foodbasics.ca/flyers/foodbasics?type=2&store_code=937',
            flyerURL: 'http://ecirculaire.foodbasics.ca/flyer_data/'
        },
        {
            name: 'Metro',
            flyerIdURL: 'http://ecirculaire.metro.ca/flyers/metro?type=2&store_code=4460',
            flyerURL: 'http://ecirculaire.metro.ca/flyer_data/'
        },
        {
            name: 'Fortinos',
            flyerIdURL: 'http://flyers.fortinos.ca/flyers/fortinos-flyer?type=2&store_code=2265',
            flyerURL: 'http://flyers.fortinos.ca/flyer_data/'
        },
        {
            name: 'Lococos',
            flyerIdURL: 'http://flyer.lococos.ca/flyers/lococos?type=2&store_code=2',
            flyerURL: 'http://flyer.lococos.ca/flyer_data/'
        },
        {
            name: 'Walmart',
            flyerIdURL: 'https://flyers.walmart.ca/flyers/walmartcanada?type=2&store_code3037',
            flyerURL: 'http://flyers.walmart.ca/flyer_data/'
        }
    ];
    var groceries = {};
    for (var i = 0; i < stores.length; i++) {
        var store = stores[i];
        store.flyerId = await getFlyerId(store.flyerIdURL);
        groceries[store.name] = await getGroceries(store);
    }
    res.send(JSON.stringify(groceries));
});

app.get(/^(\/static\/.+)$/, function(req, res) {
    res.sendFile(req.params[0], { root: __dirname });
});

app.listen(port);
console.log('Listing on port ' + port);
