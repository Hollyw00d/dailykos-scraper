var express = require('express');
var router = express.Router();
var favoritesController = require('../controllers/favoritesController');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/favorites', function(req, res) {
    console.log("router.get('/favorites'");
    favoritesController.fetchAllWithReturn()
        .then(function(favorites) {
            console.log('fetchAllWithReturn favorites', favorites);
            res.render('favorites', {favorites});
        });
}); 

module.exports = router;