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
                var $lastTr = articleTable.children().last();
                if (localStorage.getItem("saved." + article.link)) {
                    $(".save-article", $lastTr).addClass("disabled").text("Article saved!");
                }
                $lastTr.data("article", article)
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

    // If homepage (or "/" URL path) then scrape
    // DailyKos.com
    if(window.location.pathname === '/') {
        scrapeDailyKos();
    }

    // Add article to favorites
    $("table#article-table").on("click", "a.save-article", function (e) {
        e.preventDefault();
        var $saveBtn = $(this);
        var $tr = $saveBtn.closest("tr");
        var articleData = $tr.data("article");
        localStorage.setItem("saved." + articleData.link, "true")/
        $saveBtn.addClass("disabled");
        $.post("/api/favorites", {
            headlineLink: articleData.link,
            headline: articleData.headline
        }).then(function () {
            $saveBtn.removeClass("disabled");
            $saveBtn.removeClass("save-article").text("Article saved!");
        }).catch(function (err) {
            $saveBtn.removeClass("disabled");
            console.error(err);
            alert("Failed to save the article. Check the console");
        })
    })
    
    var saveTimeout = null
    $("#favorite-articles").on("input change", ".article-note", function () {
        clearTimeout(saveTimeout);

        var $textarea = $(this);
        var $li = $textarea.closest("li");
        var articleId = $li.data("article-id");

        $textarea.removeClass("border-success");

        saveTimeout = setTimeout(function () {
            $.post("/api/favorites/" + articleId, {
                note: $textarea.val()
            }).then(function () {
                $textarea.addClass("border border-success")
            }).catch(function (err) {
                console.error(err)
                alert("Failed to save the note. Check the console");
            })
        }, 500);
    });

    // Remove from favorites
    $("#favorite-articles").on("click", "a.delete-btn", function (e) {
        e.preventDefault()

        var $removeBtn = $(this)
        var $li = $removeBtn.closest("li")
        
        var articleId = $li.data("article-id")
        var articleLink = $li.data("article-link")

        $removeBtn.addClass("disabled")
        $.ajax({
            url: '/api/favorites/' + articleId,
            type: 'DELETE'
        }).then(function () {
            $removeBtn.removeAttr("disabled");
            localStorage.removeItem("saved." + articleLink);
            $li.fadeOut();
        }).catch(function (err) {
            $removeBtn.removeAttr("disabled");
            console.error(err);
            alert("Failed to remove the article. Check the console");
        });

    });
});