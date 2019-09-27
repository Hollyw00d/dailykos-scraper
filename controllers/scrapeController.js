var axios = require("axios");
var cheerio = require("cheerio");
var express = require('express');

var scraperController = function(res) {
    axios.get("https://www.dailykos.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        
        var result = {};

        // Now, we grab every h2 within an article tag, and do the following:
        $("div.story").each(function(i, element) {
          // Save an empty result object
    
          // Add the text and href of every link, and save them as properties of the result object
          result.headline = $(this)
            .find("a.designation-staff")
            .text();
          result.link = $(this)
            .find("div.story-image img")
            .attr("scr");
        });

        res.json(result);
    
      });
};

module.exports = scraperController;