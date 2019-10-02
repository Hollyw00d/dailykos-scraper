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
    function addArticlesToFavs() {
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
                $saveBtn.addClass("disabled").text("Article saved!");
            }).catch(function (err) {
                $saveBtn.removeClass("disabled");
                console.error(err);
                alert("Failed to save the article. Check the console");
            })
        });
    }
    addArticlesToFavs();
    
 
    // Save note to article
    function saveNoteToArticle() {
        var saveTimeout = null
        $("#favorite-articles").on("input change", ".article-note", function () {
            clearTimeout(saveTimeout);
    
            var $textarea = $(this);
            var $textareaSuccessMsg = $textarea.next('.article-note-success');
            var $tr = $textarea.closest("tr");
            var articleId = $tr.data("article-id");
    
            $textarea.removeClass("border-success");
    
            saveTimeout = setTimeout(function () {
                $.post("/api/favorites/" + articleId, {
                    note: $textarea.val()
                }).then(function () {
                    $textarea.addClass("border border-success");
                    $textareaSuccessMsg
                        .text('Article note saved!')
                        .fadeOut(2000);
                }).catch(function (err) {
                    console.error(err)
                    alert("Failed to save the note. Check the console");
                })
            }, 500);
        });
    }
    saveNoteToArticle();

    // Remove from article from favorites
    function removeArticleFromFavs() {
        $("#favorite-articles").on("click", "a.delete-btn", function (e) {
            e.preventDefault()
    
            var $removeBtn = $(this);

            var $tr = $removeBtn.closest("tr")
            
            var articleId = $tr.data("article-id")
            var articleLink = $tr.data("article-link")

            $.ajax({
                url: '/api/favorites/' + articleId,
                type: 'DELETE'
            }).then(function () {
                localStorage.removeItem("saved." + articleLink);
                $tr.fadeOut();
            }).catch(function (err) {
                console.error(err);
                alert("Failed to remove the article. Check the console");
            });
    
        });
    }
    removeArticleFromFavs();

    // Clear all saved articles
    function clearAllSavedArticles() {
        $('#clear-saved').on('click', function(e) {
            e.preventDefault();
            var $saveArticleLink = $('a.save-article');
            var $favoriteArticlesTable = $('#favorite-articles');

            $.ajax({
                url: '/delete/all/favorites',
                type: 'DELETE'
            }).then(function() {
                window.localStorage.clear();
                $saveArticleLink
                    .removeClass('disabled')
                    .text('Save Article');
                $favoriteArticlesTable.find('tbody').empty();
                
            }).catch(function (err) {
                console.error(err);
                alert("Failed to delete all articles");
            });   

        });
    }
    clearAllSavedArticles();
});