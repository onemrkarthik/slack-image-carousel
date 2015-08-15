'use strict';

var FlickrAPI = require('./api');

/*
    This is the main controller for serving the sch ajax command.
 */
module.exports = function(req, res) {
    var encodedKeyword = req.params.kw;
    var perPage = req.query.per_page;
    var options = {
        perPage: perPage
    };
    /*
        this call is used by the ajax command to fetch photos for the given keyword
        @param encodedKeyword - String
        @param options - Object {
            perPage: total number of images to be fetched per page.
        }
     */
    FlickrAPI.getPhotoFeed(encodedKeyword, options)
    .then(function(photos) {
        res.send(photos);
    }, function(error) {
        res.status(404).send('Could not get photos');
    });
};
