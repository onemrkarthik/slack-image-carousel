'use strict';
var Q = require('q');
var Flickr = require('flickrapi');
var flickrOptions = {
    api_key: 'a4469b9289df7a24b71c7434b9b0baf4',
    secret: '22997f956362b60f'
};
var DEFAULT_PERPAGE = 1;
var DEFAULT_SEARCH_KEYWORD = 'red+panda';
var DEFAULT_RESPONSE_FORMAT = 'json';

/*
    Flickr returns a rawPhoto object that has all of the
    necessary information required to build an image URL.
    eg:
        photo: {
            "id": "5712802583",
            "secret": "a6d58a7616",
            "server": "2034",
            "farm": 3,
            "title":
            "Buddha statues",
            "isprimary": 0,
            "ispublic": 1,
            "isfriend": 0,
            "isfamily": 0
        }

    This function constructs and returns a valid image URL.
    https://www.flickr.com/services/api/misc.urls.html
*/
function getFlickrImageUrl(imageObj) {
    if (imageObj && imageObj.farm && imageObj.server && imageObj.id && imageObj.secret) {
        return 'https://farm' + imageObj.farm + '.static.flickr.com/' + imageObj.server + '/' + imageObj.id + '_' + imageObj.secret + '_c.jpg';
    }

    return null;
}

module.exports = {
    /*
        Builds the image objects that are required for the
        front end.
    */
    decoratePhotos: function(rawPhotos) {
        if (!rawPhotos || !rawPhotos.photos || !rawPhotos.photos.photo) {
            return [];
        }

        var decoratedPhotos = [];
        var rawPhotoArray = rawPhotos.photos.photo;
        decoratedPhotos = rawPhotoArray.map(function(rawPhoto) {
            return {
                title: rawPhoto.title,
                url: getFlickrImageUrl(rawPhoto)
            };
        });

        return decoratedPhotos;
    },

    getPhotoFeed: function(encodedSearchKeyword, options, next) {
        var deferred = Q.defer();
        var self = this;

        if (!encodedSearchKeyword) {
            encodedSearchKeyword = DEFAULT_SEARCH_KEYWORD;
        }

        this.getPhotosForSearchKeyword(encodedSearchKeyword, options)
        .then(this.decoratePhotos.bind(this))
        .then(function(decoratedPhotos) {
            var photoFeedResponse = {
                photos: decoratedPhotos,
                searchKeyword: decodeURIComponent(encodedSearchKeyword)
            };
            deferred.resolve(photoFeedResponse);
        }, function(error) {
            deferred.reject(error);
        });

        return deferred.promise.nodeify(next);
    },

    getPhotosForSearchKeyword: function(searchKeyword, options, next) {
        var deferred = Q.defer();
        var perPage = DEFAULT_PERPAGE;
        var responseFormat = DEFAULT_RESPONSE_FORMAT;

        if (!searchKeyword) {
            searchKeyword = DEFAULT_SEARCH_KEYWORD;
        }

        if (options && options.perPage) {
            perPage = options.perPage;
        }

        Flickr.tokenOnly(flickrOptions, function(error, flickr) {
            //we can now use "flickr" as our API object,
            //but we can only call public methods and access public data
            if (error || !flickr) {
                deferred.reject(error ? error : new Error('[MediaAPI.getMedia] Could not instantiate flickr'));
            } else {
                flickr.photos.search({
                    tags: searchKeyword,
                    per_page: perPage,
                    format: responseFormat
                }, function(error, result) {
                    if (error) {
                        deferred.reject(new Error('[MediaAPI.getMedia] Failed to retrieve media'));
                    } else {
                        deferred.resolve(result);
                    }
                });
            }
        });

        return deferred.promise.nodeify(next);
    }
};
