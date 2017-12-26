var express = require('express');
var app = express();

app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'pug');

var fixtureData = require('./fixture_data.json');
app.locals.barChartHelper = require('./bar_chart_helper');

app.get('/', function(req, res) {
  res.render('index', { fixtureData: fixtureData });
});

app.listen(4000);
console.log('listening on port 4000');
