$(document).ready(function() {

    function scrapeDailyKos() {
        var scrapeSuccess  = $('#scrape-success');
        var scrapeFail = $('#scrape-fail');

        $.ajax({
            url: '/scrape',
            method: 'GET'
        })
        // If scrape successful
        // show success msg and hide fail msg
        .done(function(data) {
            scrapeFail.addClass('d-none');
            scrapeSuccess.removeClass('d-none');
        })
        // If scrape failure
        // show fail msg and hide success msg
        .fail(function(data) {
            scrapeFail.removeClass('d-none');
            scrapeSuccess.addClass('d-none');
        });
    }

    scrapeDailyKos();
    
});