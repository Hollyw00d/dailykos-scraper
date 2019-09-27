var scraperController = require('../controllers/scrapeController');
var express = require('express');
var app = express();

app.get('/scrape', function(req, res) {
    scraperController(res);
});