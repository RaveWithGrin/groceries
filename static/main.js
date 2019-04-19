$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/getGroceries',
        success: parseGroceries
    });
});

var parseGroceries = function(data) {
    var groceries = JSON.parse(data);
    console.log(JSON.stringify(groceries, null, 2));
};
