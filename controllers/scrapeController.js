var axios = require("axios");
var cheerio = require("cheerio");
var express = require('express');

var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var urlToScrape = 'https://www.dailykos.com';

var scraperController = function(res) {
    axios.get(urlToScrape).then(function(response) {
       
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        
        var result = [];

        // Now, we grab every h2 within an article tag, and do the following:
        $("div.story-intro").each(function(i, element) {
          // Save an empty result object
    
          // Add the text and href of every link, and save them as properties of the result object
          var headline = $(element)
            .find("a.designation-staff")
            .text();
          var link = $(element)
            .find("a.designation-staff")
            .attr("href");
          
          if(headline !== '') {
            result.push({
              headline,
              link: urlToScrape + link
            });
          }

        });

        console.log(result);
        res.json(result);
    
      });
};

module.exports = scraperController;