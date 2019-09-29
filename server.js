var axios = require('axios');
var cheerio = require('cheerio');
var express = require('express');
var exphbs  = require('express-handlebars');
var logger = require('morgan');
var mongoose = require('mongoose');
var app = express();
var router = express.Router();

// Setting up DB connection
var config = require('./config/database');
mongoose.connect(config.database, { useUnifiedTopology: true, useNewUrlParser: true });

// Assign port
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//setting up handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Make public a static folder
app.use(express.static("public"));

// Setting up routes
var indexRoute = require('./routes');
var scraperController = require('./controllers/scrapeController');

app.use('/', indexRoute);


app.get('/scrape', function(req, res) {
    scraperController(res);
});

app.listen(PORT, function () {
    console.log('Listening on http://localhost:' + PORT);
});