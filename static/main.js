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

var filterStore = function(store) {
    currentStore = store;
    applyFilters();
};

var filterCategory = function(category) {
    currentCategory = category;
    applyFilters();
};

var parseGroceries = function(data) {
    groceries = JSON.parse(data);

    for (var store in groceries) {
        var storeHTML = '<div class="tab" onclick=\'filterStore("' + store + '")\'>' + store + '</div>';
        $('#store-container').append(storeHTML);
    }

    var categoryHTML = '<div class="tab" onclick=\'filterCategory("All")\'>All</div>';
    $('#category-container').append(categoryHTML);
    for (var category in groceries.allStores) {
        categoryHTML = '<div class="tab" onclick=\'filterCategory("' + category + '")\'>' + category + '</div>';
        $('#category-container').append(categoryHTML);
    }
    applyFilters();
};

var applyFilters = function() {
    $('#items-container').empty();
    for (var category in groceries[currentStore]) {
        if (category === currentCategory || currentCategory === 'All') {
            for (var i = 0; i < groceries[currentStore][category].length; i++) {
                var item = groceries[currentStore][category][i];
                var itemHTML =
                    '<div class="item">' +
                    '<img class="item-image" src="' +
                    item.image +
                    '"/>' +
                    '<div class="item-name' +
                    (item.wanted ? ' item-wanted' : '') +
                    '">' +
                    item.name +
                    '</div>' +
                    '<div class="item-description">' +
                    item.description +
                    '</div>' +
                    '<div class="item-price">' +
                    item.price +
                    ' / ' +
                    item.priceText +
                    '</div>' +
                    '<div class="item-time">' +
                    item.validFrom +
                    ' - ' +
                    item.validTo +
                    ' @ ' +
                    item.store +
                    '</div>' +
                    '</div>';
                $('#items-container').append(itemHTML);
            }
        }
    }
};
