const favoritesModel = require('../models/favorites');
const notesModel = require('../models/notes');

const create = function(req, res) {
    console.log('favoritesController.create START');

    // Trusting user input which I should never do!
    const {headline, headlineLink, note} = req.body;
    console.log('favoritesController.js headline: ', headline);
    console.log('headlineLink: ', headlineLink);
    console.log('note: ', note);

    let newNote = new notesModel({
        note: note || " "
    })
    
    newNote.save().then(function(note) {
            let newFavorite = new favoritesModel({
                headline,
                headlineLink,
                note: note._id
            });
            
            return newFavorite.save()
        }).then(function(document) {
            console.log('document: ', document);
            res.status(200).json(document);
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);
        });
    console.log('favoritesController.create END');
};


const remove = function(req, res) {
    console.log('favoritesController.remove START');

    // Trusting user input which I should never do!
    const _id = req.params.id;
    console.log('_id: ', _id);

    favoritesModel.remove({
        _id
    }).then(function(document) {
            console.log('document removed: ', _id);
            res.status(200).json({
                success: true,
                message: "Article removed from favorites."
            });
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);
        });
    console.log('favoritesController.remove END');
};

const removeAll = function(req, res) {
    favoritesModel.remove({})
        .then(function(document) {
            res.status(200).json({
                success: true,
                message: "All article removed from favorites."
            });
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);
        });
};

const update = function (req, res) {

    const _id = req.params.id
    const note = req.body.note

    favoritesModel.findOne({
        _id: _id
    }).then(function(article) {
        if (!article) {
            return res.status(404).json({
                message: "Article not found."
            })
        }

        return notesModel.update({
            _id: article.note
        }, {
            note
        })
    }).then(function() {
            res.status(200).json({
                success: true
            });
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);  
        });
}

const fetchAll = function(req, res) {
    favoritesModel.find({}).populate("note")
        .then(function(favorites) {
            res.status(200).json(favorites);
        })
        .catch(function(err) {
            console.log('error: ', err);
            res.status(500).json(err);  
        });
};

const fetchAllWithReturn = function(req, res) {
    return favoritesModel.find({}).populate("note")
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
    update,
    remove,
    removeAll,
    fetchAllWithReturn
};