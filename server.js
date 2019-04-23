var express = require('express');
var morgan = require('morgan');
var groceries = require('./groceries')();

var app = express();
var port = process.env.PORT || 8081;

app.use(morgan('tiny'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.sendFile('main.html', { root: __dirname });
});

app.get('/getGroceries', async function(req, res) {
    res.send(JSON.stringify(await groceries.getAllGroceries()));
});

app.get(/^(\/static\/.+)$/, function(req, res) {
    res.sendFile(req.params[0], { root: __dirname });
});

app.listen(port);
console.log('Listing on port ' + port);

process.on('unhandledRejection', function(error) {
    console.error(error);
    process.exit(1);
});
