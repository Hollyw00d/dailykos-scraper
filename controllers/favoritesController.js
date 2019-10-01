const favoritesModel = require('../models/favorites');

const create = function(req, res) {
    console.log('favoritesController.create START');
    // Trusting user input which I should never do!
    const {headline, headlineLink, note} = req.body;
    console.log('favoritesController.js headline: ', headline);
    console.log('headlineLink: ', headlineLink);
    console.log('note: ', note);
    let newFavorite = new favoritesModel({
        headline,
        headlineLink,
        note
    });
    newFavorite.save()
        .then(function(document) {
            console.log('document: ', document);
            res.status(200).json(document);
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);
        });
    console.log('favoritesController.create END');
};

const fetchAll = function(req, res) {
    favoritesModel.find({})
        .then(function(favorites) {
            res.status(200).json(favorites);
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);  
        });
};

const fetchAllWithReturn = function(req, res) {
    return favoritesModel.find({})
        .then(function(favorites) {
            return favorites;
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);  
        });
};

module.exports = {
    create,
    fetchAll,
    fetchAllWithReturn
};