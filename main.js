var request = require('request-promise');

var getGroceries = async function(store) {
    var options = {
        url: store.url,
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

var main = async function() {
    var stores = [
        {
            name: 'No Frills',
            url: 'http://flyers.nofrills.ca/flyer_data/2496238?locale=en'
        },
        {
            name: 'Food Basics',
            url: 'http://ecirculaire.foodbasics.ca/flyer_data/2483336?locale=en'
        },
        {
            name: 'Metro',
            url: 'http://ecirculaire.metro.ca/flyer_data/2486720?locale=en'
        },
        {
            name: 'Fortinos',
            url: 'http://flyers.fortinos.ca/flyer_data/2487869?locale=en'
        },
        {
            name: 'Lococos',
            url: 'http://flyer.lococos.ca/flyer_data/2464276?locale=en'
        },
        {
            name: 'Walmart',
            url: 'http://flyers.walmart.ca/flyer_data/2486735?locale=en'
        }
    ];
    var groceries = {};
    for (var i = 0; i < stores.length; i++) {
        var store = stores[i];
        groceries[store.name] = await getGroceries(store);
    }
    console.log(JSON.stringify(groceries, null, 2));
};

main();

process.on('unhandledRejection', function(error) {
    console.error(error);
    process.exit(1);
});
