$(document).ready(function() {

    function scrapeDailyKos() {
        var scrapeSuccess  = $('#scrape-success');
        var scrapeFail = $('#scrape-fail');

        var articleTable = $('#article-table > tbody');

        $.ajax({
            url: '/scrape',
            method: 'GET'
        })
        // If scrape successful
        // show success msg and hide fail msg
        .done(function(data) {
            scrapeFail.addClass('d-none');
            scrapeSuccess.removeClass('d-none');
            data.map(function(article, index) {
                articleTable.append('<tr><td><h3 class="h4"><a href="' + article.link + '" target="_blank">' + article.headline + '</a></h3>' + '<p><a href="#" class="save-article text-success" data-id="' + index + '">Save Article</a></p>' + '</td></tr>');
            });
        })
        // If scrape failure
        // show fail msg and hide success msg
        .fail(function(data) {
            scrapeFail.removeClass('d-none');
            scrapeSuccess.addClass('d-none');
            articleTable.empty();
        });
    }

    scrapeDailyKos();
    
});