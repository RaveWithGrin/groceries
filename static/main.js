var currentCategory = 'All';
var currentStore = 'allStores';
var groceries;

$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/getGroceries',
        success: parseGroceries
    });
});

var parseGroceries = function(data) {
    groceries = JSON.parse(data);

    for (var store in groceries) {
        var storeHTML = '<div class="tab">' + store + '</div>';
        $('#store-container').append(storeHTML);
    }

    var categoryHTML = '<div class="tab">All</div>';
    $('#category-container').append(categoryHTML);
    for (var category in groceries.allStores) {
        categoryHTML = '<div class="tab">' + category + '</div>';
        $('#category-container').append(categoryHTML);
    }
    applyFilters();
};

var applyFilters = function() {
    for (var category in groceries[currentStore]) {
        if (category === currentCategory || currentCategory === 'All') {
            for (var i = 0; i < groceries[currentStore][category].length; i++) {
                var item = groceries[currentStore][category][i];
                var itemHTML =
                    '<div class="item"><img class="item-image" src="' +
                    item.image +
                    '"/><div class="item-name">' +
                    item.name +
                    '</div><div class="item-description">' +
                    item.description +
                    '</div><div class="item-price">' +
                    item.price +
                    ' / ' +
                    item.priceText +
                    '</div><div class="item-time">' +
                    item.validFrom +
                    ' - ' +
                    item.validTo +
                    ' @ ' +
                    item.store +
                    '</div></div>';
                $('#items-container').append(itemHTML);
            }
        }
    }
};
